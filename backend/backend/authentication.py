from django.core import signing
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from backend.firebase import db


AUTH_TOKEN_SALT = "expense-tracker-auth"
RESET_TOKEN_SALT = "expense-tracker-password-reset"

AUTH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7       # 7 days
RESET_TOKEN_MAX_AGE = 60 * 5                # 5 minutes


class FirestoreUser:
    """
    Lightweight user object used by Django REST Framework.
    """

    def __init__(self, user_data):
        self.id = user_data["id"]
        self.username = user_data.get("username", "")
        self.email = user_data.get("email", "")

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False


def create_auth_token(user_id):
    """
    Create a signed login token.
    """

    return signing.dumps(
        {
            "user_id": user_id
        },
        salt=AUTH_TOKEN_SALT
    )


def decode_auth_token(token):
    """
    Decode and validate a login token.
    """

    try:
        return signing.loads(
            token,
            salt=AUTH_TOKEN_SALT,
            max_age=AUTH_TOKEN_MAX_AGE
        )
    except signing.BadSignature:
        return None


def create_password_reset_token(user_id):
    """
    Create a password reset token valid for 5 minutes.
    """

    return signing.dumps(
        {
            "user_id": user_id
        },
        salt=RESET_TOKEN_SALT
    )


def decode_password_reset_token(token):
    """
    Decode and validate a password reset token.
    """

    try:
        return signing.loads(
            token,
            salt=RESET_TOKEN_SALT,
            max_age=RESET_TOKEN_MAX_AGE
        )
    except signing.BadSignature:
        return None


class FirestoreTokenAuthentication(BaseAuthentication):
    """
    Authenticate requests using:

    Authorization: Token <token>
    """

    def authenticate(self, request):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "token":
            raise AuthenticationFailed(
                "Invalid authorization header."
            )

        token = parts[1]

        payload = decode_auth_token(token)

        if not payload:
            raise AuthenticationFailed(
                "Invalid or expired token."
            )

        user_id = payload.get("user_id")

        if not user_id:
            raise AuthenticationFailed(
                "Invalid authentication token."
            )

        user_ref = db.collection("users").document(
            user_id
        )

        user_snapshot = user_ref.get()

        if not user_snapshot.exists:
            raise AuthenticationFailed(
                "User not found."
            )

        user_data = user_snapshot.to_dict() or {}

        user_data["id"] = user_snapshot.id

        user = FirestoreUser(user_data)

        return (user, token)