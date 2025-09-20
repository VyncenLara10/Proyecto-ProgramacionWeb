from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """
    Registro del modelo de usuario custom.
    - list_display: qué columnas vemos en el listado (rol, verificación, estado).
    - list_filter: filtros rápidos para admins (rol, verificado, activo).
    - search_fields: búsqueda rápida por username/email.
    
    Esto es clave porque:
        - El proyecto pide que los administradores puedan habilitar usuarios.
        - Aquí se puede ver fácilmente quién está verificado y qué rol tiene.
    """
    list_display = ('username','email','role','is_verified','is_active','date_joined')
    list_filter = ('role','is_verified','is_active')
    search_fields = ('username','email')
