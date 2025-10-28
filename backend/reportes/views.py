from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
import json
from .models import Reporte, BitacoraReporte
from .serializers import ReporteSerializer, ReporteSolicitudSerializer

class ReporteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Usuario solo ve sus reportes no eliminados
        return Reporte.objects.filter(usuario=self.request.user, eliminado=False)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReporteSolicitudSerializer
        return ReporteSerializer
    
    def perform_create(self, serializer):
        # Guardar información de no repudio
        reporte = serializer.save(
            usuario=self.request.user,
            ip_solicitud=self.get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Registrar en bitácora
        BitacoraReporte.objects.create(
            reporte=reporte,
            accion='solicitud_creada',
            detalles=f"Solicitud de reporte {reporte.tipo_reporte}",
            ip_address=self.get_client_ip(),
            user_agent=self.request.META.get('HTTP_USER_AGENT', '')
        )
    
    @action(detail=True, methods=['post'])
    def solicitar_reporte(self, request, pk=None):
        """Solicitar generación de reporte"""
        reporte = self.get_object()
        
        if reporte.estado != 'pendiente':
            return Response(
                {'error': 'El reporte ya fue procesado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Aquí irá la lógica de generación de reportes
        reporte.estado = 'procesando'
        reporte.save()
        
        BitacoraReporte.objects.create(
            reporte=reporte,
            accion='procesamiento_iniciado',
            detalles='Inicio de generación de reporte',
            ip_address=self.get_client_ip(),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # TODO: Llamar a función async para generar reporte
        
        return Response({'estado': 'procesando'})
    
    @action(detail=True, methods=['get'])
    def descargar(self, request, pk=None):
        """Descargar reporte generado"""
        reporte = self.get_object()
        
        if reporte.estado != 'completado' or not reporte.archivo_generado:
            return Response(
                {'error': 'Reporte no disponible para descarga'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        BitacoraReporte.objects.create(
            reporte=reporte,
            accion='descarga_solicitada',
            detalles=f'Descarga de reporte {reporte.formato_salida}',
            ip_address=self.get_client_ip(),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # TODO: Servir archivo
        return Response({'url_descarga': reporte.archivo_generado.url})
    
    def get_client_ip(self):
        x_forwarded_for = self.request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = self.request.META.get('REMOTE_ADDR')
        return ip

