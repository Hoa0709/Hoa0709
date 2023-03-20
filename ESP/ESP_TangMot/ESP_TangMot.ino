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
int leddieuchinhdosang = D0;
int ledNhaLuon = D6;
int maybom1st = D5;
String fireStatus = "";

// Khai báo biến với thư viện DHT
#define DHTPIN D1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Khai báo cảm biến ánh sáng
#define LIGHTPIN 0 // Analog A0

// Khai báo PIR HC-SR501
//#define PIRPIN D3
#define PIRPIN2 D7
int motion_st = 0;

// Lấy h online từ ntpserver
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void setup() {
  // Xuất outbound 115200
  Serial.begin(115200);

  // Khai báo setup LED
  pinMode(leddieuchinhdosang, OUTPUT);
  pinMode(ledNhaLuon, OUTPUT);
  pinMode(maybom1st, OUTPUT);

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
//  pinMode(PIRPIN, INPUT);
  pinMode(PIRPIN2, INPUT);
}

void loop() {
  cam_bien_do_tang_mot();
  thietBiDieuKhien1st();
  maybom1();
  Serial.println("");
}

// hàm máy bơm
void maybom1(){
  String maybom1 = Firebase.getString("may_bom/1st/status");
  if (maybom1 == "ON") {
    digitalWrite(maybom1st, HIGH);
    Serial.println("Máy bơm tầng 1 đang chạy");
  }
  else {
    digitalWrite(maybom1st, LOW);
    Serial.println("Máy bơm tầng 1 đang tắt");
  }
}
// Hàm chứa các thiết bị điều khiển
void thietBiDieuKhien1st() {
  if (digitalRead(PIRPIN2) == HIGH) {
    Serial.println("Đèn báo cú đang bật");
    Firebase.setInt("nhaLuon/motion", 1);
    digitalWrite(ledNhaLuon, HIGH);
  }
  else {
    Serial.println("Đèn báo cú đang tắt");
    Firebase.setInt("nhaLuon/motion", 0);
    digitalWrite(ledNhaLuon, LOW);
  }
}

// Hàm chứ các thiết bị đo đạt
void cam_bien_do_tang_mot() {
  // kiểm tra update time của NTPCLient
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  // Giờ Phút Giây
  String formattedTime = timeClient.getFormattedTime();
  //Thứ Ngày Tháng Năm
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday; // ngày
  int currentMonth = ptm->tm_mon + 1; // tháng
  int currentYear = ptm->tm_year + 1900; // nămứ
  String currentDate = String(currentYear) + "-" + String(currentMonth) + "-" + String(monthDay) + " " + String(formattedTime);
  //Serial.println(currentDate);

  // Cây thư mục chứ data đo đạt đc gửi đến fiebase
  String ThietBiDo = "1st/";
  String ThietBiDo1 = "G/";
  
  // Gửi time đo đạt đến Firebase
  Firebase.setString(ThietBiDo + "Time", formattedTime);
  Firebase.setString("deviceCheck/timeDevice2", currentDate);

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

  // Gửi dữ liệu ánh sáng đến firebase
  int light = analogRead(LIGHTPIN); // dùng chân anallog để đọc % độ sáng
  light = (light * 100) / 1024;
  int light_real = 100 - light;
  Serial.println((String)"light_real   = " + light_real + " %");
  Firebase.setInt(ThietBiDo + "Light", light_real);
  Firebase.setInt(ThietBiDo1 + "Light", light_real);

  String ledslider = Firebase.getString("nhaLuon/lightLevel");
  String kiemtraLED = Firebase.getString("nhaLuon/lightStatus");
  if (kiemtraLED == "OFF") {
    int lightend = 700-((Firebase.getInt("nhaLuon/Light")*1024)/100);
    Serial.println(lightend);
//    light = 0;
    analogWrite(leddieuchinhdosang, lightend);
  }
  else {
    int abc = ledslider.toInt();
    analogWrite(leddieuchinhdosang, abc);
  }

  // Kiểm tra trình trạng Firebase nếu lỗi
  if (Firebase.failed()) {
    Serial.println(Firebase.error());
  }

}
