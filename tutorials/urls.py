# tutorials/urls.py

from django.urls import path
from . import views

app_name = 'tutorials'  # So you can use {% url 'tutorials:tutorials' %}

urlpatterns = [
    path('', views.tutorials_home, name='tutorials'),
]
