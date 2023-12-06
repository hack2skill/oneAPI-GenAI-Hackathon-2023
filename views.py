from django.shortcuts import render
from django.http import HttpResponse

shplist=["T-shirt Contrast Pocket","Basic Flowing Scarf"]
rcmdlist=["black shoe","Basic Flowing Scarf"]

itemDescription={"T-shirt Contrast Pocket":['$30','static/img/shopping-cart/cart-1.jpg'],"Basic Flowing Scarf":["$47.00","static/img/shopping-cart/cart-3.jpg"],
"black shoe":["$32.50","static/img/shopping-cart/cart-2.jpg"]}
fullDetail=[]
for it in shplist:
    currlst=[]
    currlst.append(it)
    for jk in itemDescription[it]:
        currlst.append(jk)
    fullDetail.append(currlst)
rcdflist=[]
for it in rcmdlist:
    currlst=[]
    currlst.append(it)
    for jk in itemDescription[it]:
        currlst.append(jk)
    rcdflist.append(currlst)

# Create your views here.
def home(request):
    return render(request,'index.html')

def casa(request):
    return render(request,'tgg.html')

def cart(request):
    return render(request,'shopping-cart.html',{"lst":fullDetail,"rlst":rcdflist})





# @register.filter
# def get_index(lst, i):
#     return lst[i]

def test12(request):
    return render(request,"test12.html",{"lst":shplist,"rlst":rcdflist})
