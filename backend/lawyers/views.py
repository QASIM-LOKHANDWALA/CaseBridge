from django.http import Http404
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import LawyerProfile
from users.models import User
from users.models import User
from users.serializers import UserSerializer
from rest_framework import status

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
    if request.method == 'GET':
        try:
            lawyer = LawyerProfile.objects.get(id=lawyer_id)
        except LawyerProfile.DoesNotExist:
            return Response({'error': 'Lawyer not found'}, status=status.HTTP_404_NOT_FOUND)
        clients = lawyer.hires.filter(status='accepted')
        client_data = [{'client_id': hire.client.id, 'client_name': hire.client.full_name} for hire in clients]
        return Response(client_data, status=status.HTTP_200_OK)
    