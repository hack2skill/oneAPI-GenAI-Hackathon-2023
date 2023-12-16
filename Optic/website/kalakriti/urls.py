"""
URL configuration for Optic project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('shop/', views.shopping, name="addcart"),
    path('chat/', views.chatbot, name='chat'),
    path('cart/', views.cart, name='cart'),
    path('imagecnn/', views.image_cnn, name='imagecnn'),
    path('shop/<int:id>/', views.product_info, name='shop_new'),
    path('chart/<int:cart_id>/', views.cart_delete, name="delete_product"),
    path('order/<int:cart_id>',views.deliver,name="order"),
    path('mail/<int:cart_id>',views.deliver,name = "mail")
]
