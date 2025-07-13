from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import CaseAppointment
from users.models import User
from lawyers.models import LawyerProfile
from clients.models import GeneralUserProfile

from .serializers import CaseAppointmentSerializer

class ScheduleAppointmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            lawyer_profile = LawyerProfile.objects.get(user=request.user)
        except LawyerProfile.DoesNotExist:
            return Response({"error": "Only lawyers can schedule appointments."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        user_id = data.get("user_id")
        appointment_date = data.get("appointment_date")
        appointment_time = data.get("appointment_time")

        if not user_id or not appointment_date or not appointment_time:
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(GeneralUserProfile, id=user_id)

        appointment = CaseAppointment.objects.create(
            user=user,
            lawyer=lawyer_profile,
            title=data.get("title", "Appointment with Client"),
            description=data.get("description", ""),
            appointment_date=appointment_date,
            appointment_time=appointment_time,
            status='pending'
        )

        serializer = CaseAppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)