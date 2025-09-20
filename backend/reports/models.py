from django.db import models
from django.conf import settings
from common.models import BaseUUIDModel

class ReportRequest(BaseUUIDModel):
    """
    Solicitud de reporte por rango de fechas.
    El generador (tarea/endpoint) actualizará 'status' y 'file_path'.
    """
    class Status(models.TextChoices):
        QUEUED = "QUEUED", "En cola"
        SENT = "SENT", "Enviado"
        FAILED = "FAILED", "Falló"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='report_requests')
    date_from = models.DateField()
    date_to = models.DateField()
    delivered_to = models.EmailField()
    file_path = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=8, choices=Status.choices, default=Status.QUEUED)
