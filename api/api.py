import requests,json,gravbox
from flask import Flask,request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

@app.route('/api/gravbox',methods=['POST'])
def compile_program():
    req_data = request.get_json()
    print(req_data)
    code = req_data['code']
    stack = req_data['stack']
    balls = req_data['balls']
    direction = req_data['direction']
    direction = int(direction) if type(direction) == str else direction
    step = req_data['step']
    result = gravbox.run_program(code,st = stack, input_pause = True,balls = balls,direction = direction,start_step=step)
    return result

if __name__ == '__main__':
    app.run(debug=True,port=5000)
