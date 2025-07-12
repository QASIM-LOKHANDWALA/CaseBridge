from rest_framework import serializers
from users.models import User
from clients.serializers import GeneralUserProfileSerializer
from lawyers.serializers import LawyerProfileSerializer

class UserSerializer(serializers.ModelSerializer):
    general_profile = GeneralUserProfileSerializer(read_only=True)
    lawyer_profile = LawyerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'date_joined', 'general_profile', 'lawyer_profile']
