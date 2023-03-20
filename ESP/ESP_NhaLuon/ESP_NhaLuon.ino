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

int flamePin = D1;
String fireStatus = "";

// Khai báo chân các thiết bị
#define LIGHTPIN 0 // Analog A0
#define motor D2

// Lấy h online từ ntpserver
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

void setup() {
  Serial.begin(115200);
  pinMode(flamePin, INPUT);
  pinMode(motor, OUTPUT); 
  
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
}

void loop() {
  cam_bien_do_nha_luon();
  cambienchay();
  Serial.println("");
}
// hàm cảm biến cháy
void cambienchay(){
  int flameSensor = digitalRead(flamePin);
  Serial.print("flamePin Value: ");
  Serial.println(flameSensor);
  if (flameSensor==LOW){ // HIGH MEANS NO FLAME
    Serial.println("Có lửa cháy");  
    Firebase.setInt("nhaKyThuat/Fire", 0);
    digitalWrite(motor, HIGH);
  }
  elsesta
  {
    Serial.println("Không có lửa cháy");  
    Firebase.setInt("nhaKyThuat/Fire", 1);
    digitalWrite(motor, LOW);
  }  
}
// Hàm chứ các thiết bị đo đạt
void cam_bien_do_nha_luon() {
  // kiểm tra update time của NTPCLient
  timeClient.update();
  unsigned long epochTime = timeClient.getEpochTime();
  // Giờ Phút Giây
  String formattedTime = timeClient.getFormattedTime();
  //Serial.print("Formatted Time: ");
  //Serial.println(formattedTime);
  //Thứ Ngày Tháng Năm
  struct tm *ptm = gmtime ((time_t *)&epochTime);
  int monthDay = ptm->tm_mday; // ngày
  int currentMonth = ptm->tm_mon + 1; // tháng
  int currentYear = ptm->tm_year + 1900; // năm
  String currentDate = String(currentYear) + "-" + String(currentMonth) + "-" + String(monthDay) + " " + String(formattedTime);
  //Serial.println(currentDate);

  // Cây thư mục chứ data đo đạt đc gửi đến fiebase
  String ThietBiDo = "nhaLuon/";
  // Gửi time đo đạt đến Firebase
  Firebase.setString("deviceCheck/timeDevice3", currentDate);
  Firebase.setString(ThietBiDo + "Time", formattedTime);

  // Gửi dữ liệu ánh sáng đến firebase
  int light = analogRead(LIGHTPIN); // dùng chân anallog để đọc % độ sáng
  light = (light * 100) / 1024;
  int light_real = 100 - light;
  Serial.println((String)"light_real   = " + light_real + " %");
  Firebase.setInt(ThietBiDo + "Light", light_real);

  // Kiểm tra trình trạng Firebase nếu lỗi
  if (Firebase.failed()) {
    Serial.println(Firebase.error());
  }

}
