from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Hire
from lawyers.models import LawyerProfile
from clients.models import GeneralUserProfile
from .serializers import HireLawyerSerializer

class HireLawyerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lawyer_id):
        user = request.user

        if user.role != 'general':
            return Response({'error': 'Only general users can hire lawyers.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            client_profile = user.general_profile
        except GeneralUserProfile.DoesNotExist:
            return Response({'error': 'Client profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        lawyer = get_object_or_404(LawyerProfile, id=lawyer_id)

        serializer = HireLawyerSerializer(data=request.data)
        if serializer.is_valid():
            hire = Hire.objects.create(
                client=client_profile,
                lawyer=lawyer,
                case_description=serializer.validated_data['case_description'],
                deposit_amount=500.00,
                is_paid=True,
                status='pending'
            )
            return Response({'message': 'Hire request sent.', 'hire_id': hire.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RespondToHireRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, hire_id):
        user = request.user

        if user.role != 'lawyer':
            return Response({'error': 'Only lawyers can respond to hire requests.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            hire = Hire.objects.get(id=hire_id)
        except Hire.DoesNotExist:
            return Response({'error': 'Hire request not found.'}, status=status.HTTP_404_NOT_FOUND)

        if hire.lawyer.user != user:
            return Response({'error': 'You are not authorized to respond to this hire request.'}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')

        if new_status not in ['accepted', 'rejected']:
            return Response({'error': 'Invalid status. Must be "accepted" or "rejected".'}, status=status.HTTP_400_BAD_REQUEST)

        hire.status = new_status
        hire.save()

        return Response({'message': f'Hire request {new_status} successfully.'}, status=status.HTTP_200_OK)