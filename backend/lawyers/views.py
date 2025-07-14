from django.http import Http404
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import LawyerProfile, LegalCase
from users.models import User
from appointments.models import CaseAppointment
from clients.models import GeneralUserProfile
from users.serializers import UserSerializer
from appointments.serializers import CaseAppointmentSerializer
from rest_framework import status
from django.utils import timezone
class LawyerListView(ListAPIView):
    queryset = User.objects.filter(role='lawyer')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LawyerDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise Http404
    
    def get(self, request, user_id):
        lawyer = self.get_object(user_id)
        serializer = UserSerializer(lawyer)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
def get_lawyer_clients(request, lawyer_id):
    try:
        lawyer = LawyerProfile.objects.get(id=lawyer_id)
    except LawyerProfile.DoesNotExist:
        return Response({'error': 'Lawyer not found'}, status=status.HTTP_404_NOT_FOUND)

    hires = lawyer.hires.filter(status='accepted')

    client_data = []
    for hire in hires:
        client = hire.client
        user = client.user

        total_cases = LegalCase.objects.filter(client=client, lawyer=lawyer).count()
        active_cases = LegalCase.objects.filter(client=client, lawyer=lawyer, status='active').count()

        client_data.append({
            "id": client.id,
            "name": client.full_name,
            "phone": client.phone_number,
            "email": user.email,
            "activeCases": active_cases,
            "totalCases": total_cases,
            "status": "Active" if active_cases > 0 else "Inactive"
        })

    return Response(client_data, status=status.HTTP_200_OK)
    
class LawyerAppointmentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            lawyer_profile = user.lawyer_profile
        except LawyerProfile.DoesNotExist:
            return Response({"error": "You are not authorized to view appointments."}, status=status.HTTP_403_FORBIDDEN)

        appointments = CaseAppointment.objects.filter(lawyer=lawyer_profile).order_by('-appointment_date')

        serializer = CaseAppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LawyerCasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            lawyer_profile = user.lawyer_profile
        except LawyerProfile.DoesNotExist:
            return Response({"error": "You are not authorized to view cases."}, status=status.HTTP_403_FORBIDDEN)

        cases = LegalCase.objects.filter(lawyer=lawyer_profile).order_by('-created_at')

        return Response({
            "cases": [
                {
                    "id": case.id,
                    "title": case.title,
                    "client": case.client.full_name,
                    "court": case.court,
                    "case_number": case.case_number,
                    "next_hearing": case.next_hearing,
                    "status": case.status,
                    "priority": case.priority,
                    "created_at": case.created_at
                } for case in cases
            ]
        }, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user

        try:
            lawyer_profile = user.lawyer_profile
        except LawyerProfile.DoesNotExist:
            return Response({"error": "You are not authorized to create cases."}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        required_fields = ['title', 'client_id', 'court', 'case_number', 'next_hearing']

        for field in required_fields:
            if field not in data:
                return Response({"error": f"{field} is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            client = GeneralUserProfile.objects.get(id=data['client_id'])
        except GeneralUserProfile.DoesNotExist:
            return Response({"error": "Client not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            legal_case = LegalCase.objects.create(
                title=data['title'],
                client=client,
                lawyer=lawyer_profile,
                court=data['court'],
                case_number=data['case_number'],
                next_hearing=data['next_hearing'],
                status=data.get('status', 'active'),
                priority=data.get('priority', 'medium'),
                last_update=timezone.now()
            )

            return Response({
                "message": "Legal case created successfully.",
                "case": {
                    "id": legal_case.id,
                    "title": legal_case.title,
                    "client": legal_case.client.full_name,
                    "court": legal_case.court,
                    "case_number": legal_case.case_number,
                    "next_hearing": legal_case.next_hearing,
                    "status": legal_case.status,
                    "priority": legal_case.priority,
                    "created_at": legal_case.created_at
                }
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": "Failed to create legal case.", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
