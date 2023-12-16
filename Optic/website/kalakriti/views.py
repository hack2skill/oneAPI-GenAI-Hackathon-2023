import io
from django.core.mail import EmailMessage, get_connection
from django.conf import settings
from PIL import Image
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Product, Cart, Chat
from .utils import Intel_Model
from django.utils import timezone
import qrcode
import pandas as pd

# Create your views here.
product = Product()
product_data = Product.objects.all().values()
product_json = {'product_data': product_data.values()}

intel_model = Intel_Model()

df = pd.DataFrame(product_data)
columns_to_drop = ['id', 'created_at', 'image']
df = df.drop(columns_to_drop, axis=1)
print(df)
df.to_csv('product.csv', index=False, header=True)


def index(request):
    if request.user.is_authenticated:
        product_json_new = {'product_data': product_data.values()}
        return render(request, 'index.html', product_json_new)

    else:
        return redirect('login')


def shopping(request):
    if request.user.is_authenticated:
        return render(request, 'shop.html', product_json)
    else:
        return redirect('login')


def chatbot(request):
    if request.method == 'POST':
        print("hiiiiii")
        user_query = request.POST.get('message')
        print(user_query)

        chatbot_response = intel_model.chat(user_query)

        chat = Chat(user=request.user, message=user_query, response=chatbot_response, created_at=timezone.now())
        chat.save()
        return JsonResponse({'message': user_query, 'response': chatbot_response})
    if request.user.is_authenticated:
        chats = Chat.objects.filter(user=request.user)
        return render(request, 'chatbot.html', {'chats': chats})
    else:
        return redirect('login')


def cart(request):
    if request.user.is_authenticated:
        data = Cart.objects.filter(user_id=request.user.id).all().values()

        return render(request, 'cart.html', {'cartdata': data})
    else:
        return redirect('login')


def image_cnn(request):
    pillow_image = None
    if request.method == "POST":
        f = request.FILES.getlist('file')  # here you get the files needed
        for image in f:
            pillow_image = Image.open(io.BytesIO(image.read()))
        print(pillow_image)
        description = intel_model.Image_Description_Generation(pillow_image)
        return render(request, "chatbot.html", {"response": description})


def product_info(request, id):
    if request.method == 'POST':

        product_id = request.POST.get('product_id')

        get_product_info = Product.objects.filter(id=product_id).all().values()
        for data in get_product_info:
            cart_data = Cart(product_id=product_id, user_id=request.user.id, image_path=data['image'],
                             name=data['name'], price=data['price'])
        cart_data.save()
        product_jd = {'product_data': product_data.values(), 'message': 'Added Product to Cart'}
        return render(request, 'shop.html', product_jd)

    product_info = Product.objects.filter(id=id).values()
    individual_product = {'data': product_info}
    img = qrcode.make(id)
    print(img)
    img.save('static/img/qr.png')
    return render(request, 'sproduct.html', individual_product)


def cart_delete(request, cart_id):
    Cart.objects.filter(id=cart_id).delete()
    return redirect('cart')


def deliver(request, cart_id):
    if request.user.is_authenticated:
        get_cart_details = Cart.objects.filter(id=cart_id).all().values()
        with get_connection(
                host=settings.EMAIL_HOST,
                port=settings.EMAIL_PORT,
                username=settings.EMAIL_HOST_USER,
                password=settings.EMAIL_HOST_PASSWORD,
                use_tls=settings.EMAIL_USE_TLS
        ) as connection:
            EmailMessage("Your order", get_cart_details, settings.EMAIL_HOST_USER  , request.user.email, connection=connection).send()
