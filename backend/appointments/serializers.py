from rest_framework import serializers
from .models import CaseAppointment

class CaseAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseAppointment
        fields = '__all__'
