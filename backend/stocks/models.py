from django.db import models
from common.models import BaseUUIDModel

class Exchange(BaseUUIDModel):
    """
    Bolsa/mercado donde cotiza la acción (e.g., NASDAQ, NYSE).
    Útil para filtrar y validar símbolos.
    """
    code = models.CharField(max_length=16, unique=True)  # p.ej. "NASDAQ"
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.code

class Sector(BaseUUIDModel):
    """
    Sector/industria para navegación y filtros (requisito común de catálogo).
    """
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

class Stock(BaseUUIDModel):
    """
    Catálogo principal de acciones:
        - symbol: clave para consultar la API externa en tiempo real.
        - exchange/sector: metadata para UI y segmentación.
        - is_active: ocultar símbolos fuera de negociación.
    """
    symbol = models.CharField(max_length=16, unique=True, db_index=True)
    name = models.CharField(max_length=128)
    exchange = models.ForeignKey(Exchange, on_delete=models.PROTECT, related_name='stocks')
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True, related_name='stocks')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.symbol} - {self.name}"

class PriceCache(BaseUUIDModel):
    """
    Cache *opcional* del ÚLTIMO precio traído de la API externa.
    - No sustituye el tiempo real (solo acelera listados y reduce llamadas).
    - 'as_of' guarda cuándo se consultó.
    - Si no lo quieres, puedes omitir este modelo sin romper el resto.
    """
    stock = models.OneToOneField(Stock, on_delete=models.CASCADE, related_name='price_cache')
    last_price = models.DecimalField(max_digits=12, decimal_places=4)
    change_abs = models.DecimalField(max_digits=12, decimal_places=4, default=0)  # cambio absoluto vs. cierre anterior
    change_pct = models.DecimalField(max_digits=8, decimal_places=4, default=0)   # cambio porcentual
    as_of = models.DateTimeField(db_index=True)  # timestamp de la consulta a la API

    def __str__(self):
        return f"{self.stock.symbol} @ {self.last_price} ({self.as_of})"
