import os
import threading
import module.data as data
import time
import datetime

def control():
    os.system('python module/control.py')
def sound():
    os.system('python module/sound.py')  
def check():
    os.system('python device_check.py')
def SendDB():
    print('Sys write data is starting....')
    while True:
        now = datetime.datetime.now()
        # if now.minute == 0 or now.minute == 15 or now.minute == 30 or now.minute == 45:
        if data.WriteDB():
            print('Send DB success')
        else : print('error')    
        time.sleep(300)
threading.Thread(target=control).start()
threading.Thread(target=sound).start()
# threading.Thread(target=check).start()
# threading.Thread(target=SendDB).start()