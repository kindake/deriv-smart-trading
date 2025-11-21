from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import BotViewSet, TradeViewSet, fetch_contracts_view, run_bot_view

router = DefaultRouter()
router.register(r'bots', BotViewSet)
router.register(r'trades', TradeViewSet)

app_name = 'botbuilder'

urlpatterns = [
    # path('', botbuilder_view, name='botbuilder'),  # Name your URL patterns
    path('', views.index, name='index'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('create_bot/', views.create_bot, name='create_bot'),
    path('load_bot/', views.load_bot, name='load_bot'),
    path('load_google/', views.load_bot_google_drive, name='load_bot_google_drive'),
    path('run_bot/', views.run_bot, name='run_bot'),
    path('show_charts/', views.charts, name='show_charts'),
    #path('tutorials/', views.tutorials, name='tutorials'),
    path('quick_strategy/', views.quick_strategy, name='quick_strategy'),
    path('api/', include(router.urls)),
    path('api/bots/', views.save_bot, name='save_bot'),
    path('api/bots/', BotViewSet.as_view({'post': 'create'}), name='api-bots'),
    path('api/market-data/', views.market_data_view, name='market_data_view'),
    path('api/asset_data/', views.asset_data_view, name='asset_data_view'),
    #path('api/contracts/<str:symbol>/', views.fetch_contracts_view, name='fetch_contract_data'),
    path('api/contracts/', views.fetch_contracts_view, name='fetch_contracts_view'),
    path('api/run-bot/', views.run_bot_view, name='run_bot_view'),  # Add this URL pattern
    path('botbuilder/', views.botbuilder_view, name='botbuilder'),  # ✅ this is your HTMX-compatible view
]


