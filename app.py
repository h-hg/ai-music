from flask import Flask, render_template, send_file, request, session, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
import json
from generate import generate_melody
import datetime

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@110.43.50.22:3306/aimusic'
# 每次请求结束后都会自动提交数据库中的变动
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
# 实例化
db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'user'
    userId = db.Column(db.Integer, primary_key=True,
                       nullable=False, autoincrement=True)
    wechatId = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(32), nullable=False)
    status = db.Column(db.Boolean, nullable=False, default=False)
    avatar = db.Column(db.LargeBinary)


class Music(db.Model):
    __tablename__ = 'music'
    musicId = db.Column(db.Integer, primary_key=True,
                        nullable=False, autoincrement=True)
    userId = db.Column(db.Integer, nullable=True)
    createTime = db.Column(db.DateTime, nullable=False)
    musicName = db.Column(db.String(32), nullable=False)
    body = db.Column(db.Text, nullable=False)
    status = db.Column(db.Boolean, nullable=False, default=False)

    def tojson(self):
        jsondata = {
            'musicId': self.musicId,
            'userId': self.userId,
            'createTime': self.createTime,
            'musicName': self.musicName,
            'body': self.body
        }
        return jsondata


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST', 'GET'])
def predict():
    # notes = ['C3', 'D3', 'E3', 'C3', 'C3', 'D3', 'E3', 'C3']
    notes = json.loads(request.data)
    # print(notes)
    while(notes[-1] == 'Rest'):
        notes.pop()

    ret_midi = generate_melody(notes)
    return send_file(ret_midi, attachment_filename='return.mid',
                     mimetype='audio/midi', as_attachment=True)


@app.route('/music/<id>')
def music(id):
    return '<h1>Here is the music %s!</h1>' % id


def getdata(id):
    music = Music.query.filter_by(musicId=id).First()
    print(music)
    print(music.body)
    return music.body


@app.route('/music/save', methods=['POST',])
def save():
    mjson = json.loads(request.get_data(as_text=True))
    music = Music(userId=mjson["userId"], musicName=mjson["musicName"],
                  createTime=datetime.datetime.now(), body=mjson["body"])
    db.session.add(music)
    db.session.commit()
    return True


if __name__ == '__main__':
    app.run('0.0.0.0')
