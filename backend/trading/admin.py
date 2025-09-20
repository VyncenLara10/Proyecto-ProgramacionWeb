from django.contrib import admin
from .models import Portfolio, Holding, Order, Trade

@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    """
    Portafolio por usuario.
    Aquí puedes revisar rápidamente qué usuarios tienen portfolio asignado.
    """
    list_display = ('user','created_at')

@admin.register(Holding)
class HoldingAdmin(admin.ModelAdmin):
    """
    Posiciones de los usuarios en acciones.
    Sirve para auditar cuántas acciones tiene un usuario y a qué precio promedio.
    """
    list_display = ('portfolio','stock','quantity','avg_price')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Órdenes de compra/venta de los usuarios.
    Desde admin puedes:
        - Ver si se están generando órdenes correctamente.
        - Filtrar por estado (pendiente, ejecutada, cancelada).
    """
    list_display = ('user','stock','side','quantity','limit_price','status','executed_at')
    list_filter = ('status','side')
    search_fields = ('user__username','stock__symbol')

@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    """
    Ejecuciones (fills) de órdenes.
    Útil para comprobar que se están guardando correctamente los trades
        con precio, cantidad y comisión aplicada.
    """
    list_display = ('order','price','quantity','fee')
