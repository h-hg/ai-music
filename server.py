from flask import Flask, render_template, send_file, request, session, jsonify, redirect
from flask_sqlalchemy import SQLAlchemy
import json
from generate import generate_melody

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:123456@127.0.0.1:3306/aimusic'
# 每次请求结束后都会自动提交数据库中的变动
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
# 实例化
db = SQLAlchemy(app)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST', 'GET'])
def predict():
    # notes = ['C3', 'D3', 'E3', 'C3', 'C3', 'D3', 'E3', 'C3']
    notes = json.loads(request.data)
    # print(notes)
    ret_midi = generate_melody(notes)
    return send_file(ret_midi, attachment_filename='return.mid',
                     mimetype='audio/midi', as_attachment=True)


@app.route('/music/<id>')
def music(id):
    return '<h1>Here is the music %s!</h1>' % id


if __name__ == '__main__':
    app.run('0.0.0.0')
