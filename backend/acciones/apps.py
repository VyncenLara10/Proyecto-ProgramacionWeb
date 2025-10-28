from django.apps import AppConfig
import threading
import time
import os
from django.utils import timezone


class AccionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'acciones'

    def ready(self):
        """
        Se ejecuta automáticamente cuando Django carga la app.
        - Importa acciones si hay pocas.
        - Lanza un hilo que actualiza precios cada minuto.
        """
        from acciones.tasks import importar_acciones_automaticamente, actualizar_precios_automaticamente

        def iniciar_procesos():
            try:
                print("⚙️ Verificando si se deben importar acciones...")
                importar_acciones_automaticamente()
            except Exception as e:
                print(f"⚠️ No se pudieron importar las acciones: {e}")

            def actualizar_periodicamente():
                while True:
                    hora = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
                    print(f"⏱️ Actualizando precios automáticamente... ({hora})")
                    try:
                        actualizar_precios_automaticamente()
                    except Exception as e:
                        print(f"⚠️ Error al actualizar precios: {e}")
                    time.sleep(60)  # cada 1 minuto

            threading.Thread(target=actualizar_periodicamente, daemon=True).start()

        # Evita ejecución doble con el recargador de Django
        if os.environ.get('RUN_MAIN') == 'true':
            print("🚀 Iniciando procesos automáticos de 'acciones' (actualización cada 1 minuto)...")
            threading.Thread(target=iniciar_procesos, daemon=True).start()
