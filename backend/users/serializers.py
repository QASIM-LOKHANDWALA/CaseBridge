from rest_framework import serializers
from users.models import User
from clients.models import GeneralUserProfile
from lawyers.models import LawyerProfile

class GeneralUserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralUserProfile
        fields = ['full_name', 'address', 'phone_number', 'created_at']

class LawyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawyerProfile
        fields = [
            'full_name', 'bar_registration_number', 'specialization',
            'experience_years', 'location', 'bio', 'is_verified',
            'profile_picture', 'rating', 'created_at'
        ]

class UserSerializer(serializers.ModelSerializer):
    general_profile = GeneralUserProfileSerializer(read_only=True)
    lawyer_profile = LawyerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'date_joined', 'general_profile', 'lawyer_profile']
