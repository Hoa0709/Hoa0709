import datetime
import cv2
from flask import (
    Flask, 
    jsonify,
    redirect,
    render_template,
    Response,
    request,
    session,
    g,
    url_for
    )
from werkzeug.utils import secure_filename


import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
# Fetch the service account key JSON file contents
cred = credentials.Certificate('iot-quyduong-firebase-adminsdk-qj53a-0b3e4dd67b.json')
# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iot-quyduong-default-rtdb.firebaseio.com/'
})

ref = db.reference('sound')

app = Flask(__name__)
app.secret_key = 'someone'

UPLOAD_FOLDER = '/path/to/the/uploads'
ALLOWED_EXTENSIONS = {'mp3'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
	
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class User:
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __repr__(self):
        return f'<User: {self.username}>'
users = []
users.append(User(id=1, username='a', password='a'))

@app.before_request
def before_request():
    g.user = None
    if 'user_id' in session:
        g.user = 1

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session.pop('user_id', None)

        username = request.form['username']
        password = request.form['password']
        print(username)
        if username == 'admin' and password == 'dhcn14@':
            session['user_id'] = 1
            return redirect(url_for('home'))
        return redirect(url_for('login'))

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username',None)
    return redirect(url_for('login'))

@app.route('/')
def index():          
    return redirect(url_for('home'))

@app.route('/home')
def home():          
    if not g.user:
        return redirect(url_for('login'))
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload():
    # check if the post request has the file part
    if 'file' not in request.files:
        print('No file part')
        return redirect(request.url)
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        print('No selected file')
        return redirect(request.url)
    if file and allowed_file(file.filename):
        file.filename = datetime.datetime.now().strftime("%Y%m%d%H%M%S")+'.mp3'
        filename = secure_filename(file.filename)
        ref.update({
            'link' : file.filename
        })
        file.save(filename)     
        return jsonify(
            'send success!!!'
        )
    else: return jsonify('not file or file ALLOWED_EXTENSIONS not mp3!!!')


#Video streaming route
webcam1 = cv2.VideoCapture(0)
webcam2 = cv2.VideoCapture(1)
def process(webcam):     
    while True:
        success, frame = webcam.read()  # read the camera frame
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')   
        #concat frame one by one and return frame
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break   
    webcam.release()
    cv2.destroyAllWindows()
#cam1   
@app.route('/video_feed')
def video_feed():    
    return Response(process(webcam1),mimetype='multipart/x-mixed-replace; boundary=frame')
#cam2
@app.route('/video_feed1')
def video_feed1():    
    return Response(process(webcam1),mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/camera')
def camera():    
    return render_template('cam.html')


if __name__ == "__main__":
    app.run(host="127.0.0.1", port="8080")
