from django.db import models
from django.conf import settings
import uuid

class TimeStampedModel(models.Model):
    """
    Mixin para timestamping: nos permite saber CUÁNDO se creó/actualizó algo.
    requerido por el proyecto para trazabilidad básica.
    """
    created_at = models.DateTimeField(auto_now_add=True)  # alta
    updated_at = models.DateTimeField(auto_now=True)      # última modif

    class Meta:
        abstract = True

class SoftDeleteModel(models.Model):
    """
    Mixin para "soft delete": evitamos borrar físicamente y así mantenemos
    histórico y no repudio (se marca como is_deleted).
    """
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

class OwnedModel(models.Model):
    """
    Mixin para saber QUIÉN creó/actualizó un registro.
    Útil para auditoría y permisos.
    """
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="created_%(class)ss"
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.SET_NULL, related_name="updated_%(class)ss"
    )

    class Meta:
        abstract = True

class BaseUUIDModel(TimeStampedModel, SoftDeleteModel, OwnedModel):
    """
    Base estándar: todos los modelos del dominio heredan de aquí para:
        - id UUID (evita colisiones y filtra información de tamaño de BD)
        - timestamps + soft delete + ownership
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True
