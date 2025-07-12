from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import LawyerProfile
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