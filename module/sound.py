import os
import time
import pygame
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

# Fetch the service account key JSON file contents
cred = credentials.Certificate('iot-quyduong-firebase-adminsdk-qj53a-0b3e4dd67b.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iot-quyduong-default-rtdb.firebaseio.com/'
})
# def pmusic(file):  
def volume(num):
    pygame.mixer.music.set_volume(num / 100.0)
def stop():
    pygame.mixer.music.stop()
def pause():
    pygame.mixer.music.pause()
def unpause():
    pygame.mixer.music.unpause()

def getmixerargs():
    pygame.mixer.init()
    freq, size, chan = pygame.mixer.get_init()
    return freq, size, chan

def initMixer():
    BUFFER = 3072  # audio buffer size, number of samples since pygame 1.8.
    FREQ, SIZE, CHAN = getmixerargs()
    pygame.mixer.init(FREQ, SIZE, CHAN, BUFFER)
def play(file):
    print('Play...')
    pygame.init()
    pygame.mixer.init()
    pygame.mixer.music.load(file)
    pygame.mixer.music.play(-1)
    check = db.reference('sound/link').get() 
    ls=os.listdir("./")
    for item in ls:
        if item.endswith(".mp3") and not item == check:
            os.remove(item)
    ref = db.reference('sound')
    while pygame.mixer.music.get_busy():
        flag = 0
        while True:
            x = ref.get()
            volume(int(x['volume']))
            if int(x['mode']) == 1:
                if flag != 1 :
                    pause()
                    flag = 1
                    print("Pause")
            elif int(x['mode']) == 2:
                if flag != 2:
                    unpause()
                    flag = 2
                    print("Unpause")
            elif int(x['mode']) == 3 or x['status']=='OFF':
                stop()
                flag = 3
                print("Stop")
                ref.update({
                    'status' : 'OFF'
                })
                break
        if flag == 3 :
            break
print('He thong am thanh dang duoc chay')       
while True:
    m = db.reference('sound/status').get()
    link = db.reference('sound/link').get()
    if(m == 'ON'):
        play(link)