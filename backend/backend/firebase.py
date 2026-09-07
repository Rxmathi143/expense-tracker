import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if not firebase_admin._apps:

    if os.environ.get("FIREBASE_CREDENTIALS"):
        firebase_credentials = json.loads(
            os.environ.get("FIREBASE_CREDENTIALS")
        )
        cred = credentials.Certificate(firebase_credentials)

    else:
        SERVICE_ACCOUNT_PATH = os.path.join(
            BASE_DIR,
            "serviceAccountKey.json"
        )
        cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)

    firebase_admin.initialize_app(cred)

db = firestore.client()
