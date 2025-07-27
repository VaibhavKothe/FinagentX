import os
import json
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import base64
import smtplib
from email.mime.text import MIMEText

def pad(text):
    return text + (16 - len(text) % 16) * chr(16 - len(text) % 16)

def encrypt_text(data, key):
    cipher = AES.new(key, AES.MODE_CBC)
    ct_bytes = cipher.encrypt(pad(data).encode())
    iv = base64.b64encode(cipher.iv).decode()
    ct = base64.b64encode(ct_bytes).decode()
    return json.dumps({'iv': iv, 'ciphertext': ct})

def encrypt_user_folder(mobile_number, data_dir):
    folder_path = os.path.join(data_dir, mobile_number)
    key = get_random_bytes(16)
    encrypted_files = {}

    if not os.path.exists(folder_path):
        return None, "User folder not found", None

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if filename.endswith(".json"):
            with open(file_path, 'r') as f:
                raw = f.read()
                encrypted = encrypt_text(raw, key)
                encrypted_files[filename] = encrypted

    return encrypted_files, None, key

def send_key_to_email(email, key):
    key_str = base64.b64encode(key).decode()
    msg = MIMEText(f"Here is your secure decryption key:\n\n{key_str}")
    msg['Subject'] = "Your Encryption Key"
    msg['From'] = "rupesh.arora303@gmail.com"
    msg['To'] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login("rupesh.arora303@gmail.com", "ksmb wvzl ecfo xyij")
        server.send_message(msg)

import time

def handle_user_encryption(mobile_number, mobile_to_email, DATA_DIR, return_key=True):
    lock_file = f".session_{mobile_number}.lock"
    # Check for existing session
    if os.path.exists(lock_file):
        return None, "A session for this user is already active in another browser or tab. Please log out from other sessions before logging in again.", None

    # Create lock file
    with open(lock_file, "w") as f:
        f.write(str(time.time()))

    try:
        if mobile_number not in mobile_to_email:
            return None, "Mobile number not registered", None

        encrypted_data, error, key = encrypt_user_folder(mobile_number, DATA_DIR)

        if error:
            return None, error, None

        send_key_to_email(mobile_to_email[mobile_number], key)

        if return_key:
            return encrypted_data, None, key
        return encrypted_data, None
    except Exception as e:
        return None, (
            "Could not send email with decryption key. "
            "This may be due to a network issue or an existing session. "
            f"Technical details: {e}"
        ), None