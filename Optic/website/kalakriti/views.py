from django.shortcuts import render
from .models import Product,Cart

# Create your views here.
product = Product()
product_data = Product.objects.all()
product_json = {'product_data': product_data.values()}


def index(request):
    if request.user.is_authenticated:
        print(request.user.username)
        print("hiiiii")
    for data in product_data:
        print(data)

    return render(request, 'index.html', product_json)


def shopping(request):
    if request.method == "POST":
        product_id = request.POST.get('product_id')
        cart_data = Cart(product_id=product_id,user_id=10)
        cart_data.save()
        print(product_id)
        pass
    return render(request, 'shop.html', product_json)
