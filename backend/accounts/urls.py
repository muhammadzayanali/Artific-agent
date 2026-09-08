from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import login, me, change_password

urlpatterns = [
    path("login/", login, name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", me, name="me"),
    path("change-password/", change_password, name="change_password"),
]
