#!/usr/bin/python
# -*- coding: utf-8 -*-
'''server/app.py - main api app declaration'''

import os

# import urllib.request

from flask import Flask, request, redirect, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import subprocess
import json

app = Flask(__name__, static_folder='../build')
CORS(app)

##
# API routes
##

app.secret_key = 'secret key'
app.config['UPLOAD_FOLDER'] = '/home/rt/Documents/drJure/Protein-Validation-and-theory-of-graphs/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

ALLOWED_EXTENSIONS = set([
    'pdb',
    'pdf',
    'png',
    'jpg',
    'jpeg',
    'gif',
    ])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() \
        in ALLOWED_EXTENSIONS


@app.route('/pdb/<path:path>')
def send_js(path):
    return send_from_directory('js', path)

@app.route('/calZScore', methods=['POST'])
def calZscore():
    if 'file1' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file1']
    if file.filename == '':
        resp = jsonify({'message': 'No file selected for uploading'})
        resp.status_code = 400
        return resp
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded.pdb'))
        resp = jsonify({'message': 'File successfully uploaded'})
        resp.status_code = 201
        print("file uploaded")
        # req_data = request.get_json(force=True)
        # formId = req_data['formId']
        ex = json.loads(request.form.get('formId'))
        print ex
        print("form id printed ")
        output1 = os.system('/usr/bin/Rscript /home/rt/Documents/drJure/Protein-Validation-and-theory-of-graphs/ProtModAna1.r>newFile1.txt')

        f = open('newFile1.txt','r').read().split('\n')

        line = ''
        zScore = ''
        for i in f:
          line += i + '\r\n'
          print i
          if 'Z-score' in i:
              zScore = i

        # return line
        resp = \
            jsonify({
                'output': line,
                'zScore': zScore
                    })
        resp.status_code = 200
        return resp
        # return line
    else:
        resp = \
            jsonify({'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'
                    })
        resp.status_code = 400
        return resp


@app.route('/file-upload', methods=['POST'])
def upload_file():

    # check if the post request has the file part

    if 'file1' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    file = request.files['file1']
    file2 = request.files['file2']
    if file.filename == '':
        resp = jsonify({'message': 'No file selected for uploading'})
        resp.status_code = 400
        return resp
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded.pdb'))
        file2.save(os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded2.pdb'))
        resp = jsonify({'message': 'File successfully uploaded'})
        resp.status_code = 201
        print("file uploaded")
        # req_data = request.get_json(force=True)
        # formId = req_data['formId']
        ex = json.loads(request.form.get('formId'))
        print ex
        print("form id printed ")
        output1 = os.system('/usr/bin/Rscript /home/rt/Documents/drJure/Protein-Validation-and-theory-of-graphs/ProtModAna1.r>newFile1.txt')
        output1 = os.system('/usr/bin/Rscript /home/rt/Documents/drJure/Protein-Validation-and-theory-of-graphs/ProtModAna2.r>newFile2.txt')

        output = os.system('/usr/bin/Rscript /home/rt/Documents/drJure/flask-react-boilerplate/server/myRscript2.r>newFile.txt')
        # f = open('newFile.txt', 'r').splitlines()
        f = open('newFile1.txt','r').read().split('\n')
        f2 = open('newFile2.txt','r').read().split('\n')

        outPdb1 = open('/home/rt/Documents/drJure/flask-react-boilerplate/outputPDB/outputPDB1.pdb', 'r')

        data1 = ""
        lines = outPdb1.readlines()
        for line in lines:
            data1 = data1 + line.strip() + "\r"
        outPdb2 = open('/home/rt/Documents/drJure/flask-react-boilerplate/outputPDB/outputPDB2.pdb', 'r')
        data2 = ""
        lines = outPdb2.readlines()
        for line in lines:
            data2 = data2 + line.strip() + "\r"
        # result = subprocess.run(['ls', '-l'], stdout=subprocess.PIPE)

        # result=subprocess.run(['ls', '-l'],stdout=subprocess.PIPE)
        line = ''
        line2 = ''
        for i in f:
          line += i +'</br>'
        for i in f2:
          line2 += i +'</br>'
        resp = \
            jsonify({
                'output1': line,
                'output2': line2,
                'outputPdb1': data1,
                'outputPdb2': data2
                    })
        resp.status_code = 200
        return resp
        # return line
    else:
        resp = \
            jsonify({'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'
                    })
        resp.status_code = 400
        return resp


@app.route('/api/items')
def items():
    '''Sample API route for data'''

    return jsonify([{'title': 'A'}, {'title': 'B'}])


##
# View route
##

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    '''Return index.html for all non-api routes'''

  # pylint: disable=unused-argument

    return send_from_directory(app.static_folder, 'index.html')
