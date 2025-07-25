from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_payment_request, name='create_payment_request'),
    path('', views.get_lawyer_transactions, name='get_lawyer_transactions'),
    path('stats/', views.get_payment_stats, name='get_payment_stats'),
    path('<int:id>/update/', views.update_transaction_status, name='update_transaction_status'),
]