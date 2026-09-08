import os
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException

from backend.firebase import db
from django.core.mail import send_mail

from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from backend.authentication import (
    create_auth_token,
    create_password_reset_token,
    decode_password_reset_token,
)
from backend.firestore_users import (
    create_user,
    get_user_by_username,
    get_user_by_email,
    verify_password,
    update_password,
)

from backend.firestore_transactions import (
    create_transaction,
    get_transactions,
    get_transaction,
    update_transaction,
    delete_transaction,
)


# =========================
# Register
# =========================
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        # -------------------------
        # VALIDATION
        # -------------------------

        if not username or not email or not password:
            return Response(
                {
                    "error": "Username, email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 6:
            return Response(
                {
                    "error": "Password must be at least 6 characters long."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------
        # CREATE FIRESTORE USER
        # -------------------------

        user, error = create_user(
            username=username,
            email=email,
            password=password,
        )

        if error:
            return Response(
                {"error": error},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------
        # CREATE AUTH TOKEN
        # -------------------------

        token = create_auth_token(
            user["id"]
        )

        return Response(
            {
                "message": "User registered successfully",
                "username": user["username"],
                "token": token,
            },
            status=status.HTTP_201_CREATED
        )
# =========================
# Category
# =========================

class CategoryViewSet(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        categories_ref = db.collection("categories")
        categories = categories_ref.stream()

        data = []

        for category in categories:

            category_data = category.to_dict()

            data.append({
                "id": category.id,
                "name": category_data.get("name", "")
            })

        return Response(data)

    def post(self, request):

        name = request.data.get("name")

        if not name:
            return Response(
                {"error": "Category name is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        category_ref = db.collection("categories").document()

        category_ref.set({
            "name": name
        })

        return Response(
            {
                "id": category_ref.id,
                "name": name
            },
            status=status.HTTP_201_CREATED
        )


# =========================
# Transactions
# =========================

# =========================
# Login
# =========================
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):

    username = request.data.get("username")
    password = request.data.get("password")

    # -------------------------
    # VALIDATION
    # -------------------------

    if not username or not password:
        return Response(
            {
                "error": "Username and password are required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -------------------------
    # FIND USER IN FIRESTORE
    # -------------------------

    user = get_user_by_username(username)

    if not user:
        return Response(
            {
                "error": "Invalid username or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # -------------------------
    # CHECK PASSWORD
    # -------------------------

    if not verify_password(user, password):
        return Response(
            {
                "error": "Invalid username or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    # -------------------------
    # CREATE AUTH TOKEN
    # -------------------------

    token = create_auth_token(
        user["id"]
    )

    return Response(
        {
            "message": "Login successful.",
            "username": user["username"],
            "token": token,
        },
        status=status.HTTP_200_OK
    )


class ForgotCredentialsView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = get_user_by_email(email)

        if not user:
            return Response(
                {
                    "error":
                    "No account found with this email address."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------
        # CREATE RESET TOKEN
        # -------------------------

        reset_token = create_password_reset_token(
            user["id"]
        )

        # -------------------------
        # RESET LINK
        # -------------------------

        reset_link = (
            "https://expense-tracker-a8ftkfywk-rxmathi143s-projects.vercel.app"
            f"/reset-password/{user['id']}/{reset_token}/"
        )

        # -------------------------
        # SEND EMAIL USING BREVO
        # -------------------------

        try:

            configuration = sib_api_v3_sdk.Configuration()

            configuration.api_key["api-key"] = os.getenv(
                "BREVO_API_KEY"
            )

            api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
                sib_api_v3_sdk.ApiClient(configuration)
            )

            sender = sib_api_v3_sdk.SendSmtpEmailSender(
                email=os.getenv("EMAIL_FROM"),
                name="Expense Tracker"
            )

            send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
                sender=sender,
                to=[
                    sib_api_v3_sdk.SendSmtpEmailTo(
                        email=email
                    )
                ],
                subject="Reset your Expense Tracker password",
                html_content=f"""
                    <h2>Password Reset</h2>

                    <p>Hello {user['username']},</p>

                    <p>
                        You requested account recovery for your
                        Expense Tracker account.
                    </p>

                    <p>
                        <strong>Username:</strong>
                        {user['username']}
                    </p>

                    <p>
                        To reset your password, click the button below:
                    </p>

                    <p>
                        <a href="{reset_link}"
                           style="
                           display:inline-block;
                           padding:12px 20px;
                           background:#000;
                           color:#fff;
                           text-decoration:none;
                           border-radius:6px;
                           ">
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This password reset link will expire in
                        <strong>5 minutes</strong>.
                    </p>

                    <p>
                        If the link has expired, please request a new
                        password reset link.
                    </p>

                    <p>
                        If you did not request this, you can safely
                        ignore this email.
                    </p>

                    <p>
                        Regards,<br>
                        Expense Tracker Team
                    </p>
                """
            )

            response = api_instance.send_transac_email(
                send_smtp_email
            )

            print("BREVO RESPONSE:", response)

        except ApiException as e:

            print("BREVO ERROR:", e)

            return Response(
                {
                    "error":
                    "Unable to send password reset email."
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {
                "message":
                "Username and password reset link have been sent to your registered email."
            },
            status=status.HTTP_200_OK
        )

class ResetPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        user_id = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        # -------------------------
        # CHECK REQUIRED DATA
        # -------------------------

        if not user_id or not token or not password:
            return Response(
                {
                    "error":
                    "Invalid password reset request."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------
        # CHECK PASSWORD
        # -------------------------

        if len(password) < 6:
            return Response(
                {
                    "error":
                    "Password must be at least 6 characters long."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------
        # VERIFY RESET TOKEN
        # -------------------------

        payload = decode_password_reset_token(token)

        if not payload:
            return Response(
                {
                    "error":
                    "This password reset link is invalid or has expired."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        token_user_id = payload.get("user_id")

        # Make sure the token belongs to this user
        if token_user_id != user_id:
            return Response(
                {
                    "error":
                    "This password reset link is invalid."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------
        # CHECK USER IN FIRESTORE
        # -------------------------

        user_ref = db.collection("users").document(
            user_id
        )

        user_snapshot = user_ref.get()

        if not user_snapshot.exists:
            return Response(
                {
                    "error":
                    "User account not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------
        # UPDATE PASSWORD
        # -------------------------

        update_password(
            user_id,
            password
        )

        return Response(
            {
                "message":
                "Password reset successfully."
            },
            status=status.HTTP_200_OK
        )

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard(request):

    # Get transactions from Firestore
    transactions = get_transactions(
        str(request.user.id)
    )

    total_income = 0.0
    total_expense = 0.0

    category_totals = {}

    for transaction in transactions:

        amount = float(
            transaction.get("amount", 0) or 0
        )

        transaction_type = transaction.get(
            "transaction_type"
        )

        if transaction_type == "income":

            total_income += amount

        elif transaction_type == "expense":

            total_expense += amount

            category_id = transaction.get(
                "category"
            )

            if category_id is not None:

                category_totals[category_id] = (
                    category_totals.get(category_id, 0)
                    + amount
                )

    # -------------------------
    # GET CATEGORY NAMES FROM FIRESTORE
    # -------------------------

    category_data = []

    for category_id, amount in category_totals.items():

        try:

            category_ref = db.collection("categories").document(
                str(category_id)
            )

            category_snapshot = category_ref.get()

            if category_snapshot.exists:

                category_info = category_snapshot.to_dict()

                category_name = category_info.get(
                    "name",
                    "Unknown"
                )

            else:

                category_name = "Unknown"

        except Exception:

            category_name = "Unknown"

        category_data.append({
            "category": category_name,
            "amount": amount,
        })

    # Highest expense first
    category_data.sort(
        key=lambda item: item["amount"],
        reverse=True
    )

    balance = total_income - total_expense

    return Response({
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "category_expenses": category_data,
    })


# =========================
# Firestore Transactions
# =========================

class FirestoreTransactionListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = get_transactions(str(request.user.id))
        return Response(transactions)

    def post(self, request):
        data = request.data

        required_fields = [
            "title", "amount", "transaction_type", "category_id", "date"
        ]
        missing = [f for f in required_fields if f not in data]

        if missing:
            return Response(
                {"error": f"Missing fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        transaction = create_transaction(
            user_id=str(request.user.id),
            title=data.get("title"),
            amount=data.get("amount"),
            transaction_type=data.get("transaction_type"),
            category_id=data.get("category_id"),
            description=data.get("description", ""),
            date=data.get("date"),
        )

        return Response(transaction, status=status.HTTP_201_CREATED)


class FirestoreTransactionDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, transaction_id):
        transaction = get_transaction(str(request.user.id), transaction_id)

        if not transaction:
            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(transaction)

    def put(self, request, transaction_id):
        data = request.data

        updated = update_transaction(
            user_id=str(request.user.id),
            transaction_id=transaction_id,
            title=data.get("title"),
            amount=data.get("amount"),
            transaction_type=data.get("transaction_type"),
            category_id=data.get("category_id"),
            description=data.get("description", ""),
            date=data.get("date"),
        )

        if not updated:
            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(updated)

    def delete(self, request, transaction_id):
        deleted = delete_transaction(str(request.user.id), transaction_id)

        if not deleted:
            return Response(
                {"error": "Not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(status=status.HTTP_204_NO_CONTENT)
