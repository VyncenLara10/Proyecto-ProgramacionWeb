from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from django.db.models import Q
import pytz
import yfinance as yf

# 📘 Swagger para documentación
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Accion
from .serializers import (
    AccionListSerializer,
    AccionDetailSerializer
)
from .tasks import obtener_tickers_yahoo


# 🕒 Verifica si el mercado está abierto (horario NYSE)
def mercado_abierto():
    tz_ny = pytz.timezone('America/New_York')
    ahora = datetime.now(tz_ny)
    if ahora.weekday() >= 5:  # sábado o domingo
        return False
    apertura = ahora.replace(hour=9, minute=30, second=0, microsecond=0)
    cierre = ahora.replace(hour=16, minute=0, second=0, microsecond=0)
    return apertura <= ahora <= cierre


class AccionViewSet(viewsets.ModelViewSet):
    """
    ViewSet principal para manejar acciones bursátiles.
    Permite listar, buscar, agregar desde Yahoo y obtener detalle o histórico.
    """
    queryset = Accion.objects.all()
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_serializer_class(self):
        if self.action in ['list', 'habilitadas', 'buscar']:
            return AccionListSerializer
        return AccionDetailSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'agregar_desde_yahoo']:
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.AllowAny]
        return [p() for p in permission_classes]

    # ✅ Sobrescribir retrieve() → Actualiza el precio al obtener detalle
    @swagger_auto_schema(
        operation_description="Devuelve los datos actualizados en tiempo real de una acción específica.",
        responses={200: AccionDetailSerializer()}
    )
    def retrieve(self, request, *args, **kwargs):
        try:
            accion = self.get_object()
        except Accion.DoesNotExist:
            return Response({"error": "Acción no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # 🔄 Actualiza el precio si el mercado está abierto
        if mercado_abierto():
            try:
                data = yf.Ticker(accion.simbolo)
                fast = data.fast_info
                nuevo_precio = fast.get("last_price", accion.precio_actual)
                if nuevo_precio and nuevo_precio != accion.precio_actual:
                    accion.precio_actual = nuevo_precio
                    accion.cambio = fast.get("regular_market_change", 0)
                    accion.cambio_porcentaje = fast.get("regular_market_percent_change", 0)
                    accion.volumen = fast.get("last_volume", accion.volumen)
                    accion.updated_at = timezone.now()
                    accion.save(update_fields=["precio_actual", "cambio", "cambio_porcentaje", "volumen", "updated_at"])
            except Exception as e:
                print(f"⚠️ No se pudo actualizar el precio de {accion.simbolo}: {e}")

        serializer = self.get_serializer(accion)
        return Response(serializer.data)

    # ✅ Lista las acciones habilitadas (para usuarios)
    @swagger_auto_schema(
        operation_description="Lista las acciones disponibles para los usuarios finales (habilitadas por el administrador).",
        responses={200: AccionListSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def habilitadas(self, request):
        acciones = Accion.objects.filter(disponibilidad=True)
        serializer = self.get_serializer(acciones, many=True)
        return Response(serializer.data)

    # ✅ Agregar acción desde Yahoo Finance (solo admin)
    @swagger_auto_schema(
        operation_description="Agrega manualmente una nueva acción a la base de datos obteniendo los datos desde Yahoo Finance.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'simbolo': openapi.Schema(type=openapi.TYPE_STRING, description="Símbolo de la acción, por ejemplo: AAPL, TSLA")
            },
            required=['simbolo']
        ),
        responses={201: "Acción agregada correctamente"}
    )
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def agregar_desde_yahoo(self, request):
        simbolo = request.data.get('simbolo', '').upper().strip()
        if not simbolo:
            return Response({"error": "Debe proporcionar un símbolo."}, status=400)

        if '$' in simbolo or '.' in simbolo:
            return Response({"error": f"El símbolo '{simbolo}' no es válido para Yahoo Finance."}, status=400)

        if Accion.objects.filter(simbolo=simbolo).exists():
            return Response({"error": "Esta acción ya existe."}, status=400)

        try:
            data = yf.Ticker(simbolo)
            info = data.info
            if not info:
                return Response({"error": f"No se encontró información para '{simbolo}'."}, status=404)

            accion = Accion.objects.create(
                simbolo=simbolo,
                nombre=info.get("longName") or info.get("shortName") or simbolo,
                categoria=info.get("sector", "Desconocido"),
                precio_actual=info.get("regularMarketPrice", 0),
                cambio=info.get("regularMarketChange", 0),
                cambio_porcentaje=info.get("regularMarketChangePercent", 0),
                volumen=info.get("regularMarketVolume", 0),
                rango_dia_min=info.get("regularMarketDayLow", 0),
                rango_dia_max=info.get("regularMarketDayHigh", 0),
                rango_52w_min=info.get("fiftyTwoWeekLow", 0),
                rango_52w_max=info.get("fiftyTwoWeekHigh", 0),
                provider="Yahoo Finance",
                disponibilidad=False
            )

            return Response({
                "mensaje": f"Acción '{simbolo}' agregada correctamente.",
                "id": accion.id,
                "nombre": accion.nombre
            }, status=201)
        except Exception as e:
            return Response({"error": f"No se pudo agregar la acción: {e}"}, status=500)

    # 🔍 Buscar por nombre o símbolo parcial
    @swagger_auto_schema(
        operation_description="Permite buscar acciones por nombre o símbolo (parcial o completo).",
        manual_parameters=[
            openapi.Parameter('q', openapi.IN_QUERY, description="Nombre o símbolo (parcial o completo)", type=openapi.TYPE_STRING, required=True),
        ],
        responses={200: AccionListSerializer(many=True)}
    )
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def buscar(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({"error": "Debe proporcionar ?q=..."}, status=400)

        acciones = Accion.objects.filter(Q(nombre__icontains=query) | Q(simbolo__icontains=query))
        if not acciones.exists():
            return Response({"mensaje": "No se encontraron resultados."}, status=404)

        serializer = AccionListSerializer(acciones, many=True)
        return Response(serializer.data)

    # ✅ Buscar por símbolo exacto
    @swagger_auto_schema(
        operation_description="Busca una acción por su símbolo exacto. Si no existe en la base de datos, la agrega automáticamente desde Yahoo Finance.",
        manual_parameters=[
            openapi.Parameter('simbolo', openapi.IN_QUERY, description="Símbolo exacto (ej: AAPL, TSLA)", type=openapi.TYPE_STRING, required=True),
        ],
        responses={200: AccionDetailSerializer()}
    )
    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def por_simbolo(self, request):
        simbolo = request.query_params.get('simbolo', '').upper().strip()
        if not simbolo:
            return Response({"error": "Debe proporcionar un símbolo (?simbolo=...)"}, status=400)

        try:
            accion = Accion.objects.get(simbolo=simbolo)
        except Accion.DoesNotExist:
            try:
                if '$' in simbolo or '.' in simbolo:
                    return Response({"error": f"El símbolo '{simbolo}' no es válido para Yahoo Finance."}, status=400)

                data = yf.Ticker(simbolo)
                info = data.info
                if not info:
                    return Response({"error": f"No se encontró información para '{simbolo}'."}, status=404)

                accion = Accion.objects.create(
                    simbolo=simbolo,
                    nombre=info.get("longName") or info.get("shortName") or simbolo,
                    categoria=info.get("sector", "Desconocido"),
                    precio_actual=info.get("regularMarketPrice", 0),
                    cambio=info.get("regularMarketChange", 0),
                    cambio_porcentaje=info.get("regularMarketChangePercent", 0),
                    volumen=info.get("regularMarketVolume", 0),
                    rango_dia_min=info.get("regularMarketDayLow", 0),
                    rango_dia_max=info.get("regularMarketDayHigh", 0),
                    rango_52w_min=info.get("fiftyTwoWeekLow", 0),
                    rango_52w_max=info.get("fiftyTwoWeekHigh", 0),
                    provider="Yahoo Finance",
                    disponibilidad=False
                )
            except Exception as e:
                return Response({"error": f"No se pudo obtener '{simbolo}': {e}"}, status=500)

        serializer = AccionDetailSerializer(accion)
        return Response(serializer.data)

    # ✅ Gráfica general de una acción (histórico Yahoo)
    @swagger_auto_schema(
        operation_description="Obtiene el historial de precios de una acción para graficar. Permite definir el periodo y el intervalo de los datos.",
        manual_parameters=[
            openapi.Parameter('period', openapi.IN_QUERY, description="Rango de tiempo (1d, 5d, 1mo, 6mo, 1y, 5y, max)", type=openapi.TYPE_STRING, default='1y'),
            openapi.Parameter('interval', openapi.IN_QUERY, description="Intervalo entre puntos (1h, 1d, 1wk, 1mo)", type=openapi.TYPE_STRING, default='1d'),
        ],
        responses={200: "Lista de puntos de datos (fecha y precio)"}
    )
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def grafica(self, request, pk=None):
        try:
            accion = Accion.objects.get(pk=pk)
        except Accion.DoesNotExist:
            return Response({"error": "Acción no encontrada"}, status=404)

        period = request.query_params.get('period', '1y')
        interval = request.query_params.get('interval', '1d')

        # Validación de combinaciones permitidas
        valid_combos = {
            "1d": ["1m", "5m", "15m", "30m", "1h"],
            "5d": ["5m", "15m", "30m", "1h", "1d"],
            "1mo": ["1h", "1d"],
            "3mo": ["1d", "1wk"],
            "6mo": ["1d", "1wk"],
            "1y": ["1d", "1wk", "1mo"],
            "5y": ["1wk", "1mo"],
            "10y": ["1wk", "1mo"],
            "max": ["1mo"]
        }
        if interval not in valid_combos.get(period, []):
            return Response({
                "error": f"El intervalo '{interval}' no es válido para el periodo '{period}'."
            }, status=400)

        try:
            data = yf.Ticker(accion.simbolo)
            df = data.history(period=period, interval=interval)
            if df.empty or 'Close' not in df.columns:
                return Response({
                    "error": f"No hay datos para el rango '{period}' con intervalo '{interval}'."
                }, status=400)

            df = df.reset_index()
            fecha_col = 'Date' if 'Date' in df.columns else 'Datetime' if 'Datetime' in df.columns else None
            if not fecha_col:
                return Response({"error": "No se encontró columna de fecha en los datos."}, status=500)

            historial = [
                {"fecha": row[fecha_col].isoformat(), "precio": round(row['Close'], 2)}
                for _, row in df.iterrows()
            ]

            return Response({
                "simbolo": accion.simbolo,
                "nombre": accion.nombre,
                "periodo": period,
                "intervalo": interval,
                "historial": historial
            })
        except Exception as e:
            return Response({"error": f"No se pudo obtener el historial: {e}"}, status=500)
