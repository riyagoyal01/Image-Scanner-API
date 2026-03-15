# Image Scanner API

A Python-based application that scans images, extracts text using OCR, and identifies useful information such as email addresses, phone numbers, and URLs.

The application allows users to upload an image through a simple frontend interface. The backend processes the image, extracts text, and detects structured information using pattern matching.

## Features

* Upload images through a web interface
* Extract text from images using OCR
* Detect email addresses from the extracted text
* Detect phone numbers from the extracted text
* Detect URLs or website links
* Fast backend API built using FastAPI

## Tech Stack

* Python
* FastAPI
* Tesseract OCR
* Pillow
* Regular Expressions (Regex)
* HTML / CSS / JavaScript (Frontend)

## How It Works

1. User uploads an image from the frontend interface
2. The backend processes the image and extracts text using OCR
3. The extracted text is analyzed using regular expressions
4. Emails, phone numbers, and URLs are returned as structured data

## Example Output

```
{
  "emails": ["example@email.com"],
  "phones": ["+91-9876543210"],
  "urls": ["https://example.com"]
}
```

## Use Cases

* Extract contact information from business cards
* Identify links and contact details from screenshots
* Automate simple data extraction from images