from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.LawyerListView.as_view(), name='lawyer-list'),
    path('detail/<int:user_id>/', views.LawyerDetailView.as_view(), name='lawyer-detail'),
    path('clients/<int:lawyer_id>/', views.get_lawyer_clients, name='lawyer-clients'),
    path('appointments/', views.LawyerAppointmentsView.as_view(), name='lawyer-appointments'),
    path('cases/', views.LawyerCasesView.as_view(), name='lawyer-cases'),
    path('cases/<int:case_id>/upload-document/', views.UploadCaseDocumentView.as_view(), name='upload-case-document'),
]
