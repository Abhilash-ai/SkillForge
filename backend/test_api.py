import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')
url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}'
payload = {'contents': [{'parts': [{'text': 'Say hello world'}]}]}
response = requests.post(url, headers={'Content-Type': 'application/json'}, json=payload)
print(response.status_code)
print(response.text[:200])
