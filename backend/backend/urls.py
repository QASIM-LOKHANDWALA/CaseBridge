from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/', include('users.urls')),
    path('api/lawyers/', include('lawyers.urls')),
    path('api/appointments/', include('appointments.urls')),
    path('api/chat/', include('chat.urls')),
    path('api/hire/', include('hire.urls')),
    path('api/transactions/', include('transactions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)