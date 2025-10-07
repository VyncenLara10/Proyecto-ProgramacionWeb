from rest_framework.routers import DefaultRouter
from .views import AccionViewSet

router = DefaultRouter()
router.register(r'acciones', AccionViewSet, basename='acciones')

urlpatterns = router.urls
