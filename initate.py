import os
from flask import Flask, request, redirect, url_for, render_template, jsonify
from werkzeug.utils import secure_filename
import copy
import base64
import random

# import requests


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
	return ''.join('%02x' % ord(x) for x in os.urandom(16))

def classify( imgName ):
	return True

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
			
			# call classifier
			return "yep "+ filename
	return '404'


@app.route('/classifyCanvas',methods=['GET', 'POST'])
def upload_canvas(): 
		if request.method == 'POST':
			image_binary=base64.decodestring()
			filename = get_hash()+".jpg"
			imgpath = './uploads/'+filename
			with open(imgpath,'wb') as f:
				f.write(image_binary)
			
			# call classifier
			return "yep "+ filename
		else:
			return "404"

if __name__ == '__main__':
	app.run(debug=True)


