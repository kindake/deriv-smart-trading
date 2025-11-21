# core/views.py
from django.shortcuts import redirect, render
from django.conf import settings
from deriv_api.deriv_api import DerivAPI
from django.http import HttpResponse

def dashboard(request):
    return render(request, 'core/dashboard.html')

def botbuilder(request):
    return render(request, 'core/botbuilder.html')

def tutorials(request):
    return render(request, 'core/tutorials.html')

def freebots(request):
    return render(request, 'core/freebots.html')
