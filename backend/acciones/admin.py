from django.contrib import admin
from .models import Accion


@admin.register(Accion)
class AccionAdmin(admin.ModelAdmin):
    list_display = (
        'nombre', 'simbolo', 'precio_actual', 'disponibilidad',
        'provider', 'updated_at'
    )
    list_filter = ('disponibilidad', 'provider')
    search_fields = ('nombre', 'simbolo')
    actions = ['habilitar_acciones', 'deshabilitar_acciones']

    @admin.action(description="✅ Habilitar acciones seleccionadas")
    def habilitar_acciones(self, request, queryset):
        updated = queryset.update(disponibilidad=True)
        self.message_user(request, f"{updated} acciones habilitadas correctamente.")

    @admin.action(description="🚫 Deshabilitar acciones seleccionadas")
    def deshabilitar_acciones(self, request, queryset):
        updated = queryset.update(disponibilidad=False)
        self.message_user(request, f"{updated} acciones deshabilitadas correctamente.")
