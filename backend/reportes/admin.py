from django.contrib import admin
from .models import Reporte, BitacoraReporte

@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = ['id', 'usuario', 'tipo_reporte', 'estado', 'fecha_inicio', 'fecha_fin', 'creado_en', 'eliminado']
    list_filter = ['tipo_reporte', 'estado', 'eliminado', 'creado_en']
    search_fields = ['usuario__email', 'usuario__first_name', 'usuario__last_name']
    readonly_fields = ['creado_en', 'actualizado_en', 'procesado_en', 'ip_solicitud', 'user_agent']
    
    def get_queryset(self, request):
        return super().get_queryset(request).filter(eliminado=False)

@admin.register(BitacoraReporte)
class BitacoraReporteAdmin(admin.ModelAdmin):
    list_display = ['id', 'reporte', 'accion', 'ip_address', 'creado_en']
    list_filter = ['accion', 'creado_en']
    search_fields = ['reporte__usuario__email', 'accion', 'detalles']
    readonly_fields = ['creado_en']