from .firebase import db

def test_firebase_connection():
    test_ref = db.collection("test").document("connection")

    test_ref.set({
        "message": "Firebase connected successfully"
    })

    print("Firebase connection successful!")