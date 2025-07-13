from rest_framework import serializers
from .models import LawyerProfile

class LawyerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LawyerProfile
        fields = [
            'id', 'full_name', 'bar_registration_number', 'specialization',
            'experience_years', 'location', 'bio', 'is_verified',
            'profile_picture', 'rating', 'created_at', 'clients_served', 'cases_won'
        ]