# copy_trading/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='copy_trading'),
]
