from django.db import models
from django.conf import settings
from common.models import BaseUUIDModel

class AuditLog(BaseUUIDModel):
    """
    Bitácora de acciones relevantes:
        - action: etiqueta del evento (p.ej. ORDER_CREATE, LOGIN_SUCCESS).
        - object_type/object_id: sobre qué entidad actuó.
        - extra: JSON por si queremos guardar payload/valores antiguos.
    """
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    action = models.CharField(max_length=64)
    object_type = models.CharField(max_length=64)
    object_id = models.CharField(max_length=64)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    extra = models.JSONField(default=dict, blank=True)
