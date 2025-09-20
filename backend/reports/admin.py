from django.contrib import admin
from .models import ReportRequest

@admin.register(ReportRequest)
class ReportRequestAdmin(admin.ModelAdmin):
    """
    Solicitudes de reportes.
    Permite al admin verificar:
        - Qué usuario pidió un reporte.
        - Estado de la entrega (en cola, enviado, fallido).
    """
    list_display = ('user','date_from','date_to','status','delivered_to','file_path')
    list_filter = ('status',)
