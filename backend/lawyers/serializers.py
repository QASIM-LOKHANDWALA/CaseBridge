from rest_framework import serializers
from .models import LawyerProfile, CaseDocument

class CaseDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseDocument
        fields = ['id', 'legal_case', 'title', 'document', 'uploaded_at']
        read_only_fields = ['uploaded_at']
        
class LawyerProfileSerializer(serializers.ModelSerializer):
    documents = CaseDocumentSerializer(many=True, read_only=True)
    
    class Meta:
        model = LawyerProfile
        fields = [
            'id', 'full_name', 'bar_registration_number', 'specialization',
            'experience_years', 'location', 'bio', 'is_verified',
            'profile_picture', 'documents',  'rating', 'created_at', 'clients_served', 'cases_won'
        ]