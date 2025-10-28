from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Reporte

User = get_user_model()

class ReporteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
    
    def test_crear_reporte(self):
        reporte = Reporte.objects.create(
            usuario=self.user,
            tipo_reporte='compras_ventas',
            fecha_inicio='2024-01-01',
            fecha_fin='2024-01-31',
            formato_salida='pdf',
            ip_solicitud='127.0.0.1',
            user_agent='Test Agent'
        )
        self.assertEqual(reporte.estado, 'pendiente')
        self.assertFalse(reporte.eliminado)

class ReporteAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='api_test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_solicitar_reporte(self):
        data = {
            'tipo_reporte': 'compras_ventas',
            'fecha_inicio': '2024-01-01',
            'fecha_fin': '2024-01-31',
            'formato_salida': 'pdf'
        }
        response = self.client.post('/api/reportes/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
