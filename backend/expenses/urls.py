from django.urls import path

from .views import (
    RegisterView,
    CategoryViewSet,
    login,
    dashboard,
    ForgotCredentialsView,
    ResetPasswordView,
    FirestoreTransactionListCreateView,
    FirestoreTransactionDetailView,
)


urlpatterns = [

    # =========================
    # Categories - Firestore
    # =========================

    path(
        "categories/",
        CategoryViewSet.as_view(),
        name="categories"
    ),

    # =========================
    # Registration
    # =========================

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    # =========================
    # Login
    # =========================

    path(
        "login/",
        login,
        name="login"
    ),

    # =========================
    # Dashboard
    # =========================

    path(
        "dashboard/",
        dashboard,
        name="dashboard"
    ),

    # =========================
    # Forgot Credentials
    # =========================

    path(
        "forgot-credentials/",
        ForgotCredentialsView.as_view(),
        name="forgot-credentials"
    ),

    # =========================
    # Reset Password
    # =========================

    path(
        "reset-password/",
        ResetPasswordView.as_view(),
        name="reset-password"
    ),

    # =========================
    # Transactions - Firestore
    # =========================

    path(
        "transactions/",
        FirestoreTransactionListCreateView.as_view(),
        name="transaction-list-create"
    ),

    path(
        "transactions/<str:transaction_id>/",
        FirestoreTransactionDetailView.as_view(),
        name="transaction-detail"
    ),
]