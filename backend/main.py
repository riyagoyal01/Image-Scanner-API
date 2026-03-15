from fastapi import FastAPI, UploadFile, File
from PIL import Image
import shutil
import os
import json

from scanner import scan_image
from extractor import extract
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
RESULT_FILE = "results.json"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.post("/scan")
async def upload_file(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image = Image.open(file_path)

    text=scan_image(image)
    result = extract(text)

    if os.path.exists(RESULT_FILE):
        with open(RESULT_FILE, "r") as f:
            data = json.load(f)
    else:
        data = []

    data.append(result)

    with open(RESULT_FILE, "w") as f:
        json.dump(data, f, indent=4)
    
    return result