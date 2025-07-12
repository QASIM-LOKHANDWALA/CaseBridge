from django.urls import path
from .views import LawyerListView

urlpatterns = [
    path('list/', LawyerListView.as_view(), name='lawyer-list')
]
