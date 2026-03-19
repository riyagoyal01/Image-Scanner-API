import pytesseract

def scan_image(image):

    text = pytesseract.image_to_string(image)

    return text