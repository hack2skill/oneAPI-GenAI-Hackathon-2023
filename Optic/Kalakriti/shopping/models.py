
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Order(models.Model):
    order_id = models.AutoField(db_column='Order_id', primary_key=True)  # Field name made lowercase.
    user = models.ForeignKey('User', models.DO_NOTHING, db_column='user_id')  # Field name made lowercase.
    product = models.ForeignKey('Product', models.DO_NOTHING, db_column='product_id')  # Field name made lowercase.
    date = models.CharField(db_column='Date', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'order'


class Product(models.Model):
    product_id = models.AutoField(db_column='product_id', primary_key=True)
    company = models.CharField(db_column='Company', max_length=255)  # Field name made lowercase.
    price = models.IntegerField(db_column='Price')  # Field name made lowercase.
    image = models.ImageField(upload_to='uploads/products/')

    class Meta:
        managed = False
        db_table = 'product'


class User(models.Model):
    user_id = models.AutoField(db_column='Order_id', primary_key=True)
    password = models.CharField(db_column='Password', max_length=255)  # Field name made lowercase.
    email = models.CharField(db_column='Email', max_length=255)  # Field name made lowercase.
    name = models.TextField(db_column='Name')  # Field name made lowercase.
    mobile = models.IntegerField(db_column='Mobile')  # Field name made lowercase.
    address = models.CharField(db_column='Address', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'user'
