# copy_trading/views.py
from django.shortcuts import render

def home(request):
    return render(request, 'copy_trading/index.html', {'page_title': 'Copy Trading'})
