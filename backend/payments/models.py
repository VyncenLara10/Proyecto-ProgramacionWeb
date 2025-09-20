from django.db import models
from django.conf import settings
from common.models import BaseUUIDModel

class Wallet(BaseUUIDModel):
    """
    Billetera del usuario en la plataforma (saldo disponible).
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)

    def __str__(self):
        return f"Wallet de {self.user.username} - {self.balance}"

class Transfer(BaseUUIDModel):
    """
    Registro de depósitos y retiros:
        - ttype: tipo de movimiento (DEPOSIT/WITHDRAW).
        - status: flujo básico para conciliación.
        - reference_code: identificador externo/interno del movimiento.
    """
    class Type(models.TextChoices):
        DEPOSIT = "DEPOSIT", "Depósito"
        WITHDRAW = "WITHDRAW", "Retiro"

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendiente"
        COMPLETED = "COMPLETED", "Completada"
        FAILED = "FAILED", "Fallida"

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transfers')
    ttype = models.CharField(max_length=8, choices=Type.choices)
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reference_code = models.CharField(max_length=64, unique=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
