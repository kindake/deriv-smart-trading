# tutorials/views.py
from django.shortcuts import render

def index(request):
    return render(request, 'tutorials/dashboard.html')

def tutorials_home(request):
    return render(request, 'tutorials/index.html')
