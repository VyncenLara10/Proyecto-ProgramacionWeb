from django.db import models
from django.conf import settings
from common.models import BaseUUIDModel
from stocks.models import Stock

class Portfolio(BaseUUIDModel):
    """
    Portafolio por usuario.
    Único por usuario para simplificar consultas y permisos.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='portfolio')

    def __str__(self):
        return f"Portfolio de {self.user.username}"

class Holding(BaseUUIDModel):
    """
    Posición del usuario en un símbolo:
        - quantity: unidades actuales.
        - avg_price: precio promedio de compra (para PnL realizado/no realizado).
    El precio de mercado se consulta en la API externa cuando sea necesario.
    """
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE, related_name='holdings')
    stock = models.ForeignKey(Stock, on_delete=models.PROTECT, related_name='holdings')
    quantity = models.DecimalField(max_digits=18, decimal_places=6, default=0)
    avg_price = models.DecimalField(max_digits=12, decimal_places=4, default=0)

    class Meta:
        unique_together = ('portfolio', 'stock')

    def __str__(self):
        return f"{self.stock.symbol} x {self.quantity}"

class Order(BaseUUIDModel):
    """
    Orden de compra/venta:
        - side: BUY/SELL.
        - limit_price: si se usa lógica de orden limitada.
        - status: estado del ciclo de vida (pendiente/ejecutada/cancelada).
    La ejecución y validación de precios se hace contra la API externa.
    """
    class Side(models.TextChoices):
        BUY = "BUY", "Compra"
        SELL = "SELL", "Venta"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        EXECUTED = "EXECUTED", "Ejecutada"
        CANCELED = "CANCELED", "Cancelada"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    stock = models.ForeignKey(Stock, on_delete=models.PROTECT)
    side = models.CharField(max_length=4, choices=Side.choices)
    quantity = models.DecimalField(max_digits=18, decimal_places=6)
    limit_price = models.DecimalField(max_digits=12, decimal_places=4, null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    executed_at = models.DateTimeField(null=True, blank=True)

class Trade(BaseUUIDModel):
    """
    Resultado de ejecución (fill) de una orden.
    Permite parciales (N trades por una order).
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='trades')
    price = models.DecimalField(max_digits=12, decimal_places=4)
    quantity = models.DecimalField(max_digits=18, decimal_places=6)
    fee = models.DecimalField(max_digits=12, decimal_places=4, default=0)
