import io

import PIL
from django.core.files.storage import default_storage
from django.http import JsonResponse
from django.shortcuts import render
from PIL import Image

import os


# Create your views here.
def home(request):
    return render(request, 'index.html')


def image_cnn(request):
    if request.method == "POST":
        f = request.FILES['sentFile']  # here you get the files needed
        pillow_image = PIL.Image.open(io.BytesIO(f.read()))
        print(pillow_image)
        response = {"response": "ok"}

        return render(request, 'chatbot.html', response)
    else:
        return render(request, 'chatbot.html')


# Create your views here.
def chatbot(request):
    if request.method == 'POST':
        message = request.POST.get('message')
        return JsonResponse({'message': message, 'response': 'hello'})
    return render(request, 'chatbot.html', {'chats': 'hiii how are you'})
