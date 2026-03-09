from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, CapabilityViewSet

router = DefaultRouter()
router.register(r'', AgentViewSet, basename='agent')
router.register(r'capabilities', CapabilityViewSet, basename='capability')

app_name = 'agents'

urlpatterns = [
    path('', include(router.urls)),
]
