import os
from flask import Flask, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
import copy
import base64
import random
import uuid
import requests
import mimetypes

app = Flask(__name__)


UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = set([ 'jpg', 'jpeg'])

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
jinja_options = app.jinja_options.copy()

jinja_options.update(dict(
	variable_start_string='%%',
	variable_end_string='%%',
))
app.jinja_options = jinja_options

def allowed_file(filename):
	return '.' in filename and \
		filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_hash():
	return str(uuid.uuid4())

def classify( imgName ):
	url = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify/?api_key=108d0c27c19e91f6cd71acd2e7a577efae08152e&version=2016-05-20&owners=me&threshold=0'
	with open("./uploads/"+imgName, 'rb') as image:
		filename = image.name
		mime_type = mimetypes.guess_type(filename)[0] or 'application/octet-stream'
		files = {'test': (filename, image, mime_type)}
		r = requests.request(method = "POST", url= url, files=files)
		print(r.text)
	
	return r.text

@app.route('/')
def root():
	return render_template('project-index.html')
	# url=request.form.get('url') ;


@app.route('/classifyUpload', methods=['GET', 'POST'] )
def upload_file():
	if request.method == 'POST':
		if 'file' not in request.files:
			flash('No file part')
			return redirect(request.url)

		file = request.files['file']
		if file.filename == '':
			flash('No selected file')
			return redirect(request.url)

		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			filename+=get_hash()+filename
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))	
			catched = classify( filename )
			# call classifier
			return catched
	return '404'


@app.route('/classifyCanvas',methods=['GET', 'POST'])
def upload_canvas(): 
		if request.method == 'POST':
			# print ( type(request.form['imagebase']) )
			# return 'c'
			image_binary = base64.b64decode( request.form['imagebase'].split(",")[1] )
			filename = get_hash()+".jpg"
			imgpath = './uploads/'+filename
			with open(imgpath,'wb') as f:
				f.write(image_binary)
			
			# call classifier
			catched = classify( filename )

			return catched
		else:
			return "404"

# if __name__ == '__main__':
	# app.run(port=33507)
