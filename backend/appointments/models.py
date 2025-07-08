from django.db import models
from users.models import User
from lawyers.models import LawyerProfile

class CaseAppointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    lawyer = models.ForeignKey(LawyerProfile, on_delete=models.CASCADE, related_name='appointments')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    appointment_date = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.email} -> {self.lawyer.user.email}"