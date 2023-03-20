#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <DHT.h>

#include <Arduino.h>

// Khai báo host và key secrets
#define FIREBASE_HOST "iot-quyduong-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "E533z8Ws3eE5J0A3hf7nkTYjQcXpqKom2YbDKiyu"
// Khai báo tên và pass WIFI
#define WIFI_SSID "WiFi"
#define WIFI_PASSWORD "Cuong998"

// Khai báo LED
int led = D0;
int ledKyThuat = D5;
int maybomg = D6;
String fireStatus = "";

// Khai báo biến với thư viện DHT
#define DHTPIN D1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Khai báo PIR HC-SR501
#define PIRPIN D3
int motion_st = 0;

// Khai báo Gas MQ-2 và chuông báo động
#define GasAnalog 0 // Chân Analog 0
#define Buzzer D4

// Lấy h online từ ntpserver
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void setup() {
  // Xuất outbound 112500
  Serial.begin(112500);

  // Khai báo setup LED
  pinMode(led, OUTPUT);
  pinMode(ledKyThuat, OUTPUT);
  pinMode(maybomg, OUTPUT);
//  pinMode(Pin_D7, OUTPUT);
//  pinMode(Pin_D8, OUTPUT);

  // Kiểm tra các kết nối WIFI
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to ");
  Serial.print(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to ");
  Serial.println(WIFI_SSID);

  // Xuất ra địa chỉ IP của WIFI đã kết nối
  Serial.print("IP Address is: ");
  Serial.println(WiFi.localIP());

  //Khởi động Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

  // Khởi động timeclient của thư viện NTP để xác định time
  timeClient.begin();
  // Múi giờ VN GMT + 7 với 7*3600 = 7 * 60*60 cứ 1 múi h tăng lên 3600
  timeClient.setTimeOffset(7 * 3600);

  // Khởi đông DHT22
  dht.begin();

  // Khởi động Pir
  pinMode(PIRPIN, INPUT);

  //Khởi động chuông báo
  pinMode(Buzzer, OUTPUT); 
}

void loop() {
  cam_bien_do_tang_tret();
  dieu_khien_thiet_bi_NKT();
  maybom2();
}

// hàm máy bơm
void maybom2(){
  String maybom2 = Firebase.getString("may_bom/G/status");
  if (maybom2 == "ON") {
    digitalWrite(maybomg, HIGH);
    Serial.println("Máy bơm tầng G đang chạy");
  }
  else {
    digitalWrite(maybomg, LOW);
    Serial.println("Máy bơm tầng G đang tắt");
  }
}

// Hàm chứa các thiết bị điều khiển
void dieu_khien_thiet_bi_NKT() {
  String led = Firebase.getString("nhaKyThuat/lightStatus");
  if (led == "ON" || led == "on" || led == "On" || led == "oN") {
    //Serial.println("Led Turned ON");
    digitalWrite(ledKyThuat, HIGH);
  }
  else if (led == "OFF" || led == "off" || led == "oFF" || led == "Off") {
    //Serial.println("Led Turned OFF");
    digitalWrite(ledKyThuat, LOW);
  }
  else {
    Serial.println("Kiểm tra kết nối! Vui lòng gửi ON/OFF đến LED NKT");
  }
  
}

// Hàm chứ các thiết bị đo đạt
void cam_bien_do_tang_tret() {
  // kiểm tra update time của NTPCLient
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  // Giờ Phút Giây
  String formattedTime = timeClient.getFormattedTime();

  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday; // ngày
  int currentMonth = ptm->tm_mon + 1; // tháng
  int currentYear = ptm->tm_year + 1900; // năm
  //String currentDate = String(currentYear) + "-" + String(currentMonth) + "-" + String(monthDay); // năm tháng ngày thứ
  String currentDate = String(currentYear) + "-" + String(currentMonth) + "-" + String(monthDay) + " " + String(formattedTime);
  //Serial.println(currentDate);

  // Cây thư mục chứ data đo đạt đc gửi đến fiebase
  String ThietBiDo = "G/";

  // Gửi time đo đạt đến Firebase
  Firebase.setString("deviceCheck/timeDevice1", currentDate);
  Firebase.setString(ThietBiDo + "Time", formattedTime);

  // Khai báo biến chứa nhiệt độ và độ ẩm
  float h =  dht.readHumidity();
  float t = dht.readTemperature();
  Serial.print((String)"Temperature = " + t + " °C");
  Serial.println();
  Serial.print((String)"Humidity    = " + h + " %");
  Serial.println();

  // Gửi nhiệt độ và độ ẩm đến cây thư mục của firebase
  Firebase.setFloat(ThietBiDo + "Humidity", h);
  Firebase.setFloat(ThietBiDo + "Temperature", t);
  
  // Kiểm tra khí Gas
  float gas = analogRead(GasAnalog);
  Serial.println(gas);
  Firebase.setFloat("nhaKyThuat/Gas", gas);
  if(gas > 650){    
    Serial.println("Cảnh báo cháy");    
    digitalWrite (Buzzer, HIGH);
  }
  else{
    digitalWrite (Buzzer, LOW);
  }
  
  // Kiểm tra trình trạng Firebase nếu lỗi
  if (Firebase.failed()) {
    Serial.println(Firebase.error());
  }
}
