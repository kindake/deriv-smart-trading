# tracking/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("client-events/", views.client_events, name="client-events"),
    path("store_tokens/", views.store_tokens, name="store_tokens"),
]
