from django.contrib import admin
from django.urls import path
from .views import register_request,login_request

urlpatterns = [
    path('register/', register_request, name="register"),
    path("login", login_request, name="login")

]
