from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('api/lawyers/', include('lawyers.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/hire/', include('hire.urls')),
]