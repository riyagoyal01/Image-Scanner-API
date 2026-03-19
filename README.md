# 🔍 Image Scanner API

A full-stack web application that extracts text from images using OCR and detects **emails**, **phone numbers**, and **URLs** from the extracted text.

**Live Demo:** [https://chimerical-kangaroo-e33df4.netlify.app](https://chimerical-kangaroo-e33df4.netlify.app)

---

## 📸 What It Does

1. User uploads an image (PNG, JPG, JPEG, WEBP)
2. Backend extracts text using Tesseract OCR
3. Regex patterns detect emails, phone numbers, and URLs
4. Results are displayed in a clean, interactive UI

---

## 🗂️ Project Structure

```
Image-Scanner-API/
├── backend/
│   ├── main.py           # FastAPI app with /scan endpoint
│   ├── scanner.py        # Tesseract OCR logic
│   ├── extractor.py      # Regex pattern extraction
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Docker config for deployment
├── frontend/
│   ├── index.html        # Main UI
│   ├── styles.css        # Styling
│   └── script.js         # API calls and UI logic
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI |
| OCR Engine | Tesseract OCR (pytesseract) |
| Frontend | HTML, CSS, JavaScript |
| Containerization | Docker |
| Backend Hosting | Render (free tier) |
| Frontend Hosting | Netlify (free tier) |

---

## 🚀 API Endpoint

### `POST /scan`

Accepts an image file and returns extracted contact information.

**Request**
```
Content-Type: multipart/form-data
Field: file (image/*)
```

**Response**
```json
{
  "Email": ["example@gmail.com"],
  "Phone": ["9876543210"],
  "URLs": ["https://example.com"]
}
```

---

## 💻 Running Locally

### Prerequisites
- Python 3.8+
- [Tesseract OCR](https://github.com/UB-Mannheim/tesseract/wiki) installed at `C:/Program Files/Tesseract-OCR/tesseract.exe`

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
python -m http.server 5500
```

Frontend runs at: `http://localhost:5500`

---

## ☁️ Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Netlify | [chimerical-kangaroo-e33df4.netlify.app](https://chimerical-kangaroo-e33df4.netlify.app) |
| Backend | Render | Auto-deployed via Docker |

- **Frontend** is connected to GitHub — auto-deploys on every `git push`
- **Backend** runs in a Docker container on Render with Tesseract pre-installed

---

## 📦 Dependencies

```
fastapi
uvicorn
pillow
pytesseract
python-multipart
```

---