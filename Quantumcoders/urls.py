from django.urls import path

from . import views

urlpatterns =[
path("", views.home, name="home"),
path("casa", views.casa, name="casa"),
path("cart", views.cart, name="cart"),
path("test12", views.test12, name="test12"),
]
