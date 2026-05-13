# 🎂 Giovanni Lambert — Birthday Tribute Website

A warm, cozy, interactive birthday tribute site built with Flask + vanilla JS.

---

## 📁 Project Structure

```
giovanni/
├── app.py                  # Flask app
├── requirements.txt        # Dependencies
├── render.yaml             # Render deployment config
├── templates/
│   └── index.html          # Main page
└── static/
    ├── css/
    │   └── style.css       # All styles
    ├── js/
    │   └── main.js         # All interactions
    └── images/             # ← Put Giovanni's photos here
```

---

## 🖼️ Adding Photos

1. Put all photos inside `static/images/`
2. In `templates/index.html`, find the `gallery-grid` section
3. Replace each placeholder `<div>` with:

```html
<div class="gallery-item" data-caption="Your caption here">
  <img src="{{ url_for('static', filename='images/your-photo.jpg') }}" alt="Giovanni">
  <div class="caption">Your caption here</div>
</div>
```

---

## ✍️ Adding the Real Messages

In `templates/index.html`, find each note card and replace the placeholder text inside the `<p class="note-text">` tag with the real message.

---

## 🚀 Running Locally

```bash
pip install -r requirements.txt
python app.py
```

Then open `http://localhost:5000` in your browser.

---

## ☁️ Deploying on Render

1. Push this folder to a GitHub repository
2. Go to [render.com](https://render.com) and create a new **Web Service**
3. Connect your GitHub repo
4. Render will auto-detect the `render.yaml` config
5. Click **Deploy** — your site will be live in minutes!

---

## 🎵 Music

The playlist panel links to Spotify tracks. Clicking a song opens it in Spotify.
You can update the tracks in `main.js` inside the `selectTrack()` calls.

---

Made with 💛 for Giovanni Lambert
