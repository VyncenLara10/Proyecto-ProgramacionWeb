from rest_framework import serializers
from .models import Reporte, BitacoraReporte

class ReporteSolicitudSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = [
            'tipo_reporte', 
            'fecha_inicio', 
            'fecha_fin', 
            'formato_salida'
        ]
    
    def validate(self, data):
        if data['fecha_inicio'] > data['fecha_fin']:
            raise serializers.ValidationError(
                "La fecha de inicio no puede ser mayor a la fecha fin"
            )
        return data

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'
        read_only_fields = [
            'usuario', 'estado', 'archivo_generado', 'ip_solicitud', 
            'user_agent', 'creado_en', 'actualizado_en', 'procesado_en'
        ]

class BitacoraReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BitacoraReporte
        fields = '__all__'