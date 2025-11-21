from . import views
# core/urls.py
from django.urls import path
from .views import dashboard
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('botbuilder/', views.botbuilder, name='botbuilder'),
    path('tutorials/', views.tutorials, name='tutorials'),
    path('freebots/', views.freebots, name='freebots'),
]