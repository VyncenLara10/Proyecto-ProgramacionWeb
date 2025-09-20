from django.contrib import admin
from .models import Exchange, Sector, Stock, PriceCache

# Exchange y Sector son catálogos de referencia (bolsa, industria).
admin.site.register(Exchange)
admin.site.register(Sector)

@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    """
    Registro del catálogo de acciones.
    - Permite ver y filtrar por símbolo, exchange y sector.
    - is_active sirve para deshabilitar símbolos sin borrarlos.
    
    Esto cumple con el requisito de tener un catálogo navegable
        (landing page pública y búsquedas por categoría).
    """
    list_display = ('symbol','name','exchange','sector','is_active')
    list_filter = ('exchange','sector','is_active')
    search_fields = ('symbol','name')

@admin.register(PriceCache)
class PriceCacheAdmin(admin.ModelAdmin):
    """
    Cache del último precio traído desde API externa.
    - Facilita verificar que el proceso de actualización funciona.
    - No reemplaza los precios en tiempo real, solo acelera listados.
    
    Útil para validar que tu integración con la API de mercado
        esté guardando correctamente el último valor consultado.
    """
    list_display = ('stock','last_price','change_abs','change_pct','as_of')
    list_filter = ('as_of',)
