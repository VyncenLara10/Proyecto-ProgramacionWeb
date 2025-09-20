from django.contrib.auth.models import AbstractUser
from django.db import models
from common.models import TimeStampedModel

class User(AbstractUser, TimeStampedModel):
    """
    Usuario custom:
        - role: controla autorizaciones (Admin, Trader).
        - is_verified: admins habilitan cuentas (requisito de control).
        - referral_code / referred_by: programa de referidos del proyecto.
    """
    class Roles(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        TRADER = "TRADER", "Trader"

    role = models.CharField(max_length=12, choices=Roles.choices, default=Roles.TRADER)
    is_verified = models.BooleanField(default=False)

    referral_code = models.CharField(max_length=12, unique=True, null=True, blank=True)
    referred_by = models.ForeignKey('self', null=True, blank=True,
                                    on_delete=models.SET_NULL, related_name='referrals')

    def save(self, *args, **kwargs):
        """
        Genera un código de referido simple si no existe.
        No es criptográficamente único, pero suficiente como identificador corto.
        """
        super().save(*args, **kwargs)
        if not self.referral_code:
            base = (self.username[:4] + str(self.pk) + "X").upper()[:12]
            type(self).objects.filter(pk=self.pk).update(referral_code=base)
