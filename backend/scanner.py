import pytesseract

def scan_image(image):
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"
    text = pytesseract.image_to_string(image)

    return text