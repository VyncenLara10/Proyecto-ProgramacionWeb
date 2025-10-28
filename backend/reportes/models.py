# reportes/models.py
from django.db import models
from django.contrib.auth import get_user_model

class Reporte(models.Model):
    TIPO_REPORTE_CHOICES = [
        ('compras_ventas', 'Compras y Ventas'),
        ('ganancias_perdidas', 'Ganancias y Pérdidas'),
        ('movimientos_cuenta', 'Movimientos de Cuenta'),
        ('referidos', 'Bonos de Referidos'),
        ('portafolio', 'Portafolio General'),
    ]
    
    FORMATO_CHOICES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('csv', 'CSV'),
    ]
    
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('procesando', 'Procesando'),
        ('completado', 'Completado'),
        ('error', 'Error'),
    ]

    # Relación con usuario
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    
    # Configuración del reporte
    tipo_reporte = models.CharField(max_length=50, choices=TIPO_REPORTE_CHOICES)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    formato_salida = models.CharField(max_length=10, choices=FORMATO_CHOICES, default='pdf')
    
    # Información específica del reporte (estructura que otros equipos deben proveer)
    datos_compras = models.JSONField(default=dict, blank=True)  # {total: 5000, cantidad: 10, detalle: []}
    datos_ventas = models.JSONField(default=dict, blank=True)   # {total: 3000, cantidad: 5, detalle: []}
    datos_ganancias_perdidas = models.JSONField(default=dict, blank=True)  # {ganancia_bruta: 2000, perdida: 500, neto: 1500}
    datos_portafolio = models.JSONField(default=dict, blank=True)  # {acciones: [], valor_total: 10000}
    datos_referidos = models.JSONField(default=dict, blank=True)   # {total_bonos: 50, referidos: []}
    datos_movimientos = models.JSONField(default=dict, blank=True) # {ingresos: [], egresos: [], saldo_final: 5000}
    
    # Archivo y estado
    archivo_generado = models.FileField(upload_to='reportes/', null=True, blank=True)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    
    # Soft Delete
    eliminado = models.BooleanField(default=False)
    
    # No Repudio
    ip_solicitud = models.GenericIPAddressField()
    user_agent = models.TextField()
    jwt_payload = models.JSONField(null=True, blank=True)  # Para evidencia del token
    
    # Timestamps
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)
    procesado_en = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.tipo_reporte} - {self.usuario.email}"

class BitacoraReporte(models.Model):
    """Para auditoría completa de todas las acciones"""
    reporte = models.ForeignKey(Reporte, on_delete=models.CASCADE, related_name='bitacoras')
    accion = models.CharField(max_length=100)  # 'solicitud', 'generacion', 'envio_correo', 'descarga'
    detalles = models.TextField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.accion} - {self.creado_en}"