from rest_framework import serializers
from .models import Accion
import yfinance as yf


class AccionListSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = Accion
        fields = [
            'id', 'imagen', 'simbolo', 'nombre',
            'precio_actual', 'cambio', 'cambio_porcentaje',
            'volumen', 'history'
        ]

    def get_imagen(self, obj):
        """
        Usa la URL del logo de la empresa si está disponible en Yahoo Finance.
        """
        try:
            data = yf.Ticker(obj.simbolo)
            return data.info.get("logo_url", "")
        except Exception:
            return ""

    def get_history(self, obj):
        """
        Devuelve datos de los últimos 7 días (mini gráfica).
        """
        try:
            data = yf.Ticker(obj.simbolo)
            df = data.history(period="7d", interval="1h")
            if df.empty:
                return []

            df = df.reset_index()
            date_col = "Datetime" if "Datetime" in df.columns else "Date"

            return [{"price": round(row["Close"], 2)} for _, row in df.iterrows()]
        except Exception:
            return []


class AccionDetailSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    class Meta:
        model = Accion
        fields = '__all__'

    def get_imagen(self, obj):
        try:
            data = yf.Ticker(obj.simbolo)
            return data.info.get("logo_url", "")
        except Exception:
            return ""
