import time
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from numpy import NaN

# Fetch the service account key JSON file contents
cred = credentials.Certificate('iot-quyduong-firebase-adminsdk-qj53a-0b3e4dd67b.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iot-quyduong-default-rtdb.firebaseio.com/'
})

ref_G = db.reference('may_bom/G')
ref_NL = db.reference('nhaLuon')
def control(ref,floor):
    now = datetime.datetime.now()
    x = ref.get()    
    print(floor,'\t\t== Mode:',x['mode'],'\t| Status:',x['status'])
    if x['mode'] == 'timer_mode':
        time_on = x['time_on'].split(':') 
        time_off = x['time_off'].split(':') 
        if int(time_on[0]) == int(now.hour) and int(time_on[1]) == int(now.minute):
            if x['status'] == 'OFF':
                ref.update({
                    'status' : 'ON'
                })
                print(floor,' : May bom da bat')
        elif int(time_off[0]) == int(now.hour) and int(time_off[1])==int(now.minute):
            if x['status'] == 'ON':
                ref.update({
                    'status' : 'OFF'
                })
                print(floor,' : May bom da tat')
    elif x['mode'] == 'auto_mode':
        try:
            x1 = db.reference('G').get()
            if float(x1['Temperature']) > 32 or float(x1['Humidity']) < 80:
                if x['status'] == 'OFF':
                    ref.update({
                        'status' : 'ON'
                    })
                    print(floor,' : May bom da bat')
            else:
                if x['status'] == 'ON':
                    ref.update({
                        'status' : 'OFF'
                    })
                    print(floor,' : May bom da tat')
        except: print('')
def control_light(ref):
    now = datetime.datetime.now()
    x = ref.get()
    print('Owl lights:','\t== Mode:',x['mode'],'\t| Status:',x['lightStatus'])
    if x['mode'] == 'timer_mode':
        time_on = x['time_on'].split(':') 
        time_off = x['time_off'].split(':') 
        if int(time_on[0]) == int(now.hour) and int(time_on[1]) == int(now.minute):
            if x['lightStatus'] == 'OFF':
                ref.update({
                    'lightStatus' : 'ON'
                })
                print('Owl lights : Da bat')
        elif int(time_off[0]) == int(now.hour) and int(time_off[1])==int(now.minute):
            if x['lightStatus'] == 'ON':
                ref.update({
                    'lightStatus' : 'OFF'
                })
                print('Owl lights : Da tat')
def action_maybom():
    print('He thong dieu chinh may bom va den cu')
    while True: 
        print('May bom :...')
        control(ref_G,'G')
        print('Nha Luon:...')
        control_light(ref_NL)
        time.sleep(1)
action_maybom()