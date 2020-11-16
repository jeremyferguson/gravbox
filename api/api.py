import requests,json,gravbox,os
from flask import Flask,request

app = Flask(__name__)
path = os.path.dirname(os.path.realpath(__file__))
path += "/../samples/"
samples = {}
for fname in os.listdir(path):
    with open(path + fname, 'r') as f:
        text = f.read()
        samples[fname[:-4]] = text

@app.route('/app/compile',methods=['POST'])
def compile_program():
    req_data = request.get_json()
    code = req_data['code']
    stack = req_data['stack']
    balls = req_data['balls']
    direction = req_data['direction']
    direction = int(direction) if type(direction) == str else direction
    step = req_data['step']
    result = gravbox.run_program(code,st = stack, input_pause = True,balls = balls,direction = direction,start_step=step)
    return result

@app.route('/app/sample',methods=['POST'])
def sample_program():
    try:
        if request.method == "POST":
            req_data = request.get_json()
            if req_data:
                name = req_data['name']
                if name in samples:
                    response = {'code':samples[name]}
                else:
                    response = {'message':'name not in samples'}
            else:
                response = {'message':'Invalid request data'}
        else:
            response = {'message':'invalid request header'}
    except Exception as e:
        response = {'message':'error processing request: '+str(e)}
    return response

if __name__ == '__main__':
    app.run(debug=True,port=5000)
