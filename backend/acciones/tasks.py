import yfinance as yf
import requests
import pandas as pd
from io import StringIO
from django.utils import timezone
from .models import Accion


def obtener_tickers_yahoo(max_tickers=100):
    """
    Obtiene símbolos únicos de Yahoo Finance desde los principales índices.
    Limita la cantidad a 'max_tickers'.
    """
    headers = {"User-Agent": "Mozilla/5.0"}
    urls = {
        "S&P 500": "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies",
        "NASDAQ": "https://en.wikipedia.org/wiki/NASDAQ-100",
        "DOW": "https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average"
    }

    simbolos = set()

    for indice, url in urls.items():
        try:
            res = requests.get(url, headers=headers, timeout=10)
            tablas = pd.read_html(StringIO(res.text))
            encontrados = set()

            for tabla in tablas:
                for columna in ['Symbol', 'Ticker']:
                    if columna in tabla.columns:
                        nuevos = set(tabla[columna].dropna().astype(str))
                        encontrados |= nuevos
                        break

            print(f"✅ {indice}: {len(encontrados)} símbolos encontrados.")
            simbolos |= encontrados  # unimos sin duplicar

        except Exception as e:
            print(f"⚠️ Error leyendo {indice}: {e}")

    simbolos = sorted(list(simbolos))
    print(f"📈 Total símbolos únicos: {len(simbolos)}")

    # 🔹 Limita la cantidad de resultados si se especifica
    if max_tickers and len(simbolos) > max_tickers:
        simbolos = simbolos[:max_tickers]
        print(f"🔹 Limitado a {max_tickers} símbolos para importar.")

    return simbolos


# 🔹 Importar acciones si la base está vacía
def importar_acciones_automaticamente():
    """
    Importa automáticamente acciones desde Yahoo Finance si la base de datos está vacía o incompleta.
    """
    total = Accion.objects.count()
    limite_minimo = 100  # puedes cambiar este valor

    if total >= limite_minimo:
        print(f"✅ Ya existen {total} acciones, no se necesita importar más.")
        return

    print(f"⚠️ Solo hay {total} acciones. Importando desde Yahoo Finance...")

    simbolos = obtener_tickers_yahoo()
    existentes = set(Accion.objects.values_list('simbolo', flat=True))
    nuevas = 0
    errores = 0

    for simbolo in simbolos:
        if simbolo in existentes:
            continue

        try:
            data = yf.Ticker(simbolo)
            info = data.info
            if not info:
                continue

            nombre = info.get("longName") or info.get("shortName") or simbolo
            categoria = info.get("sector", "Desconocido")

            Accion.objects.create(
                simbolo=simbolo,
                nombre=nombre,
                categoria=categoria,
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
            nuevas += 1
        except Exception as e:
            errores += 1
            print(f"⚠️ Error importando {simbolo}: {e}")

    total_final = Accion.objects.count()
    print(f"✅ Importación completada. {nuevas} nuevas, {errores} errores. Total actual: {total_final}")


# 🔹 Actualizar precios actuales cada cierto tiempo
def actualizar_precios_automaticamente():
    """
    Actualiza el precio actual y datos de mercado de todas las acciones habilitadas.
    """
    acciones = Accion.objects.filter(disponibilidad=True, is_deleted=False)

    if not acciones.exists():
        print("⚠️ No hay acciones habilitadas para actualizar.")
        return

    print(f"🔄 Actualizando precios de {acciones.count()} acciones...")

    for accion in acciones:
        try:
            data = yf.Ticker(accion.simbolo)
            info = data.info

            if not info:
                continue

            nuevo_precio = info.get("regularMarketPrice", accion.precio_actual)
            cambio = info.get("regularMarketChange", 0)
            cambio_porcentaje = info.get("regularMarketChangePercent", 0)
            volumen = info.get("regularMarketVolume", accion.volumen)

            if nuevo_precio and nuevo_precio != float(accion.precio_actual or 0):
                accion.precio_actual = nuevo_precio
                accion.cambio = cambio
                accion.cambio_porcentaje = cambio_porcentaje
                accion.volumen = volumen
                accion.updated_at = timezone.now()
                accion.save()
                print(f"✅ {accion.simbolo}: {nuevo_precio} ({cambio_porcentaje}%) actualizado.")
        except Exception as e:
            print(f"⚠️ Error al actualizar {accion.simbolo}: {e}")

    print("✅ Actualización completa.")
