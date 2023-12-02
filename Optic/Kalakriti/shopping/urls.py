from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.home, name='index'),
    path('chatbot/', views.image_cnn, name='chatbot'),
    path('chat/', views.chatbot, name='chat'),
    path('shop/', views.shopping, name='shop'),
    path('addchart/',views.addtochart,name="addcart")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
