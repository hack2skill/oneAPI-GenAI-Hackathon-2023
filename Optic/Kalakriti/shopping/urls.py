from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='index'),
    path('home/', views.image_cnn, name='chatbot'),
    path('chatbot/', views.chatbot, name='chat')
]
