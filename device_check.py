import time
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Module
# import module.sms as sms
import module.mail as mail

import json
timedata = {
  "delay1": str(datetime.datetime.now()+datetime.timedelta(minutes = -10)),
  "delay2": str(datetime.datetime.now()+datetime.timedelta(minutes = -10)),
  "delay3": str(datetime.datetime.now()+datetime.timedelta(minutes = -10)),
  "delay4": str(datetime.datetime.now()+datetime.timedelta(minutes = -10)),
  "web" : 0
}
# Fetch the service account key JSON file contents

cred = credentials.Certificate(
    'iot-quyduong-firebase-adminsdk-qj53a-0b3e4dd67b.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iot-quyduong-default-rtdb.firebaseio.com/'
})
ref = db.reference('deviceCheck')
toaddr = 'doancnttquyduong@gmail.com'
phone = '+84939038290'
fmt = '%Y-%m-%d %H:%M:%S'
fmt1 = '%Y-%m-%d %H:%M:%S.%f'
timedata = json.loads(json.dumps(timedata))
print('He thong kiem tra thiet bi dang khoi dong !!!!')
# def check_Gas():
#     datetime_now = datetime.datetime.now()
#     refGas = db.reference('nhaKyThuat/Gas')
#     Gas = refGas.get()
#     x = 'Cảnh báo có khí dễ cháy :' + str(Gas)
#     if int(Gas) > 600:
#         delay = datetime.datetime.strptime(timedata['delay1'], fmt1)
#         if (datetime_now - delay).total_seconds() >= 60:
#             # sms.sendSms(x)
#             # mail.sendMail(toaddr, None,x)
#             timedata['delay2'] = str(datetime.datetime.now())

def sendAnnouncenum(num):
    data = ref.get()
    tr = ''
    if num == 1:
        tr = '1'
    elif num == 2:
        tr = '2'
    elif num == 3:
        tr = '3'
    time = datetime.datetime.strptime(data['timeDevice'+tr], fmt)
    note = ''
    datetime_now = datetime.datetime.now()
    minutes_diff = (datetime_now - time).total_seconds()
    if minutes_diff > 15:
        delay = datetime.datetime.strptime(timedata['delay'+tr], fmt1)
        if (datetime_now - delay).total_seconds() >= 60:
            note = 'Mất kết nối thiết bị '+ str(num) +' '+ str(int(minutes_diff/60)) + ' phút\n'
            # sms.sendSms(phone,note)
            # mail.sendMail(toaddr, None,note)
            print(note)
            timedata['delay'+tr] = str(datetime.datetime.now())
            ref.update({
                'statusDevice'+tr : 'ERROR' 
            })
    else:
        a = db.reference('deviceCheck/statusDevice'+tr).get()
        if a == 'ERROR':
            ref.update({
                'statusDevice'+tr : 'GOOD' 
            })
            print(tr+' good')
def check_Devide():
    sendAnnouncenum(1)
    sendAnnouncenum(2)
    sendAnnouncenum(3)
def sendLogIn():
    webPage = int(db.reference('deviceCheck/webPage').get())
    web = timedata['web']
    if webPage == 1 and web == 1:
        text = 'Bạn đã đăng nhập vào webpage vào lúc %s' %(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        # mail.sendMail(toaddr, None,text)
        timedata['web'] = 0
    elif webPage == 1 and web == 0:
        return
    else:
        timedata['web'] = 1

while True:
    sendLogIn()
    check_Devide()
    # check_Gas()
    time.sleep(2)