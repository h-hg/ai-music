from flask import Flask, render_template, send_file, request
import json
from generate import generate_melody

app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


@app.route('/predict', methods=['POST','GET'])
def predict():
    # notes = ['C3', 'D3', 'E3', 'C3', 'C3', 'D3', 'E3', 'C3']
    notes = json.loads(request.data)
    # print(notes)
    ret_midi = generate_melody(notes)
    return send_file(ret_midi, attachment_filename='return.mid',
                     mimetype='audio/midi', as_attachment=True)


if __name__ == '__main__':
    app.run('0.0.0.0')
