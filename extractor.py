import re

def extract(text):
    
    phone_number = re.findall(r"(\+?\d{1,3}[-\s]?)?\d{10}|\d{4}[-\s]\d{6}",text)
    emails_address = re.findall(r"[a-zA-Z0-9_.]+@[a-zA-Z0-9_.]+", text)
    website = re.findall(r"(https?://[^\s]+|www\.[^\s]+)",text)

    return {
        "Phone":phone_number,
        "Email":emails_address,
        "URLs":website
    }