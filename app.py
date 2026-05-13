from flask import Flask, render_template, request, jsonify
import os
import json
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join('static', 'images')
CAPTIONS_FILE = os.path.join('static', 'captions.json')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def load_captions():
    if os.path.exists(CAPTIONS_FILE):
        with open(CAPTIONS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_captions(captions):
    with open(CAPTIONS_FILE, 'w') as f:
        json.dump(captions, f)

@app.route('/')
def index():
    captions = load_captions()
    images = []
    if os.path.exists(UPLOAD_FOLDER):
        for filename in sorted(os.listdir(UPLOAD_FOLDER)):
            if allowed_file(filename):
                images.append({'filename': filename, 'caption': captions.get(filename, '')})
    return render_template('index.html', images=images)

@app.route('/upload', methods=['POST'])
def upload():
    if 'photo' not in request.files:
        return jsonify({'success': False, 'error': 'No file provided'}), 400
    file = request.files['photo']
    caption = request.form.get('caption', '')
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        base, ext = os.path.splitext(filename)
        counter = 1
        while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
            filename = f"{base}_{counter}{ext}"
            counter += 1
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        captions = load_captions()
        captions[filename] = caption
        save_captions(captions)
        return jsonify({'success': True, 'filename': filename, 'caption': caption, 'url': f'/static/images/{filename}'})
    return jsonify({'success': False, 'error': 'File type not allowed'}), 400

@app.route('/delete-photo', methods=['POST'])
def delete_photo():
    data = request.get_json()
    filename = data.get('filename')
    if not filename:
        return jsonify({'success': False}), 400
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(filename))
    if os.path.exists(filepath):
        os.remove(filepath)
        captions = load_captions()
        captions.pop(filename, None)
        save_captions(captions)
        return jsonify({'success': True})
    return jsonify({'success': False, 'error': 'File not found'}), 404

@app.route('/update-caption', methods=['POST'])
def update_caption():
    data = request.get_json()
    filename = data.get('filename')
    caption = data.get('caption', '')
    if not filename:
        return jsonify({'success': False}), 400
    captions = load_captions()
    captions[filename] = caption
    save_captions(captions)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True)
