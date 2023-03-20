import json
import time
import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Fetch the service account key JSON file contents
cred = credentials.Certificate('iot-quyduong-firebase-adminsdk-qj53a-0b3e4dd67b.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iot-quyduong-default-rtdb.firebaseio.com/'
})
refG = db.reference('G')
fmt = '%Y-%m-%d %H:%M:%S.%f'
def parseDay(day):
    return str(day.year)+'-'+str(day.month)+'-'+str(day.day)
daytime = {
    "day" : str(datetime.datetime.now()- datetime.timedelta(days=1)),
    "yesterday3" : parseDay(datetime.datetime.now() - datetime.timedelta(days=7)),
}
daytime = json.loads(json.dumps(daytime))
def WriteDB():
    try:
        dataG = refG.get()
        dbnow = datetime.datetime.strptime(daytime['day'], fmt)
        now = datetime.datetime.now()
        if not now.day == dbnow.day :
            db.reference('listData/G/'+daytime['yesterday3']).delete()
            daytime['day'] = str(now)
            daytime['yesterday3'] = parseDay(now - datetime.timedelta(days=7))
        today = parseDay(now)
        time = now.strftime("%H:%M:00")
        refListG = db.reference('listData/G/'+today+'/'+time)
        refListG.update({
            'Time' : time,
            'Humidity': dataG['Humidity'],
            'Light': dataG['Light'],
            'Temperature': dataG['Temperature']
        })
        return True
    except:
        return False
