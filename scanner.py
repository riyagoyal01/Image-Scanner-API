import pytesseract

def scan_image(image):

    pytesseract.pytesseract.tesseract_cmd = r"C:/Program Files/Tesseract-OCR/tesseract.exe"

    text = pytesseract.image_to_string(image)

    return text