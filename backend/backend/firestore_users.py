from datetime import datetime, timezone

from django.contrib.auth.hashers import make_password, check_password

from backend.firebase import db


USERS_COLLECTION = "users"


def create_user(username, email, password):
    """
    Create a user in Firestore.
    """

    username = username.strip()
    email = email.strip().lower()

    # Check whether username already exists
    username_query = (
        db.collection(USERS_COLLECTION)
        .where("username", "==", username)
        .limit(1)
        .stream()
    )

    if next(username_query, None) is not None:
        return None, "Username already exists."

    # Check whether email already exists
    email_query = (
        db.collection(USERS_COLLECTION)
        .where("email", "==", email)
        .limit(1)
        .stream()
    )

    if next(email_query, None) is not None:
        return None, "Email already exists."

    # Create a new Firestore document
    user_ref = db.collection(USERS_COLLECTION).document()

    user_data = {
        "username": username,
        "email": email,
        "password_hash": make_password(password),
        "created_at": datetime.now(timezone.utc),
    }

    user_ref.set(user_data)

    return {
        "id": user_ref.id,
        "username": username,
        "email": email,
    }, None


def get_user_by_username(username):
    """
    Find a user by username.
    """

    query = (
        db.collection(USERS_COLLECTION)
        .where("username", "==", username)
        .limit(1)
        .stream()
    )

    for doc in query:
        data = doc.to_dict() or {}

        return {
            "id": doc.id,
            **data,
        }

    return None


def get_user_by_email(email):
    """
    Find a user by email.
    """

    email = email.strip().lower()

    query = (
        db.collection(USERS_COLLECTION)
        .where("email", "==", email)
        .limit(1)
        .stream()
    )

    for doc in query:
        data = doc.to_dict() or {}

        return {
            "id": doc.id,
            **data,
        }

    return None


def verify_password(user, password):
    """
    Verify a password against the stored password hash.
    """

    return check_password(
        password,
        user.get("password_hash", "")
    )


def update_password(user_id, new_password):
    """
    Update a user's password.
    """

    db.collection(USERS_COLLECTION).document(
        user_id
    ).update({
        "password_hash": make_password(new_password)
    })

    return True