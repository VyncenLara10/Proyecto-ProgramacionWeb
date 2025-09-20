from django.contrib import admin
from .models import AuditLog

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """
    Bitácora de acciones (no repudio).
    Aquí puedes auditar:
        - Qué usuario hizo qué acción.
        - Desde qué IP y con qué user agent.
        - Información extra en formato JSON.
    """
    list_display = ('actor','action','object_type','object_id','ip_address','created_at')
    list_filter = ('action',)
    search_fields = ('object_type','object_id','actor__username')
