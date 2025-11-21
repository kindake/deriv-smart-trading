"""
URL configuration for D_Bots project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
# from .views import core
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from django.http import JsonResponse  # ✅ Add this

# ✅ Health-check view (Render will use this to confirm the app is live)
def render_health(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('botbuilder/', include('botbuilder.urls')),
    path('core/', include('core.urls')),
    # path('', core, name='core.urls'),
    path('tutorials/', include('tutorials.urls')),
    path('freebots/', include('freebots.urls')),
    path('users/', include('users.urls')),
    path('', include('core.urls')),  # Include core URLs for the dashboard
    path("api/", include("tracking.urls")),  # 👈 now /api/client-events/ works
    path('copy-trading/', include('copy_trading.urls')),
    path('tracking/', include('tracking.urls')),

    # ✅ Add this new line for Render health check
    path('health/', render_health),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
