from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.LawyerListView.as_view(), name='lawyer-list'),
    path('detail/<int:user_id>/', views.LawyerDetailView.as_view(), name='lawyer-detail'),
    path('clients/<int:lawyer_id>/', views.get_lawyer_clients, name='lawyer-clients')
]
