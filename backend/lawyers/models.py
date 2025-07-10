from django.db import models
from users.models import User

class LawyerProfile(models.Model):
    SPECIALIZATION_CHOICES = (
        ('criminal', 'Criminal Law'),
        ('civil', 'Civil Law'),
        ('corporate', 'Corporate Law'),
        ('family', 'Family Law'),
        ('intellectual_property', 'Intellectual Property Law'),
        ('general', 'General Practice')    
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='lawyer_profile')
    full_name = models.CharField(max_length=255)
    bar_registration_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=255, choices=SPECIALIZATION_CHOICES, default='general')
    experience_years = models.IntegerField()
    location = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='lawyer_pics/', blank=True, null=True)
    rating = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name
