from django.contrib import admin
from .models import Wallet, Transfer

@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    """
    Billetera de cada usuario en la plataforma.
    Permite ver rápidamente el saldo de cada usuario.
    """
    list_display = ('user','balance')

@admin.register(Transfer)
class TransferAdmin(admin.ModelAdmin):
    """
    Movimientos simulados de dinero (depósitos y retiros).
    Importante porque:
        - Valida el flujo de depósitos/retiros.
        - Permite buscar por reference_code para auditorías.
    """
    list_display = ('wallet','ttype','amount','fee','reference_code','status')
    list_filter = ('ttype','status')
    search_fields = ('reference_code',)
