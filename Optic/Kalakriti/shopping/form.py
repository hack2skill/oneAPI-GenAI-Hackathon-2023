from django import forms

class addcart(forms.Form):
    product_id = forms.CharField(label='product_id', max_length=100)
