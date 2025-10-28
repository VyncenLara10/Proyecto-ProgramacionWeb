from django.db import models


class Accion(models.Model):
    """
    Representa una acción bursátil obtenida desde Yahoo Finance.
    """
    nombre = models.CharField(max_length=100)
    simbolo = models.CharField(max_length=20, unique=True)
    categoria = models.CharField(max_length=50, blank=True, null=True)
    precio_actual = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    cambio = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    cambio_porcentaje = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    volumen = models.BigIntegerField(null=True, blank=True)
    rango_dia_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rango_dia_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rango_52w_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    rango_52w_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    disponibilidad = models.BooleanField(default=False)
    provider = models.CharField(max_length=50, default='Yahoo Finance')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        db_table = 'acciones'
        ordering = ['nombre']

    def __str__(self):
        return f"{self.simbolo} - {self.nombre}"
