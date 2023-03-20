from twilio.rest import Client
# Account SID
# AC67ab8052c4be573f2211902b75843e78
# Auth Token
# 048c847df11312f1902c93c2fc3837d2
# My Twilio phone number
# +18102857986
#################################################
# account_sid = 'AC367435552e27d3bda67b6a7eb9282e69'
# auth_token = 'fa7b14b8d9bf2ed2f387e1b260bb4ac2'
# phone_num = '+18102857986'
#################################################

account_sid = 'AC367435552e27d3bda67b6a7eb9282e69'
auth_token = 'fa7b14b8d9bf2ed2f387e1b260bb4ac2'

client = Client(account_sid, auth_token)

def sendSms(phonenumber,text):
    client.messages.create(
        from_='+17722093986',
        to= phonenumber,
        body = text
        )
