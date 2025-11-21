# free_bots/views.py
from django.shortcuts import render


def index(request):
    return render(request, 'freebots/dashboard.html')


