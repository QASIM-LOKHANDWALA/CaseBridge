from django.urls import path
from . import views

urlpatterns = [
    path('schedule-appointment/', views.ScheduleAppointmentView.as_view(), name='schedule-appointment'),
]
