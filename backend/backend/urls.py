from rest_framework.authtoken.views import obtain_auth_token
from django.urls import path, include

urlpatterns = [
    path("api/", include("expenses.urls")),
]