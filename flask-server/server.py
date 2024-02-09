from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_bcrypt import Bcrypt


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")




class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    is_active = db.Column(db.Boolean, default=False)

class Friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    status = db.Column(db.String(20), default='pending')



@socketio.on('signup')
def signup(data):
    try:
        username = data['username']
        password = data['password']

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        response_data = {'status': 'success', 'message': 'Registration was successful'}
        socketio.emit('signup_response', response_data)

    except Exception as e:
        print(f"Error: {e}")
        response_data = {'status': 'error', 'message': 'Error in registration'}
        socketio.emit('signup_response', response_data)

@socketio.on('login')
def login(data):
    try:
        username = data['username']
        password = data['password']

        user = User.query.filter_by(username=username).first()

        if user and user.password and bcrypt.check_password_hash(user.password, password):
            response_data = {'status': 'success', 'message': 'Login successful'}

            
            user.is_active = True
            db.session.commit()
            

        else:
            response_data = {'status': 'error', 'message': 'Invalid username or password'}

        socketio.emit('login_response', response_data)

    except Exception as e:
        print(f"Error: {e}")
        response_data = {'status': 'error', 'message': 'Error in login'}
        socketio.emit('login_response', response_data)

@socketio.on('logoff')
def logoff(data): 
    
    user = User.query.filter_by(username=data).first()
    if user:
        user.is_active = False
        db.session.commit()





if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, debug=True)


