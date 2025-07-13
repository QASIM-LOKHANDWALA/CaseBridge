from django.urls import path
from .views import dummy_payment_view

urlpatterns = [
    path('hire/<int:hire_id>/pay/', dummy_payment_view, name='dummy_payment'),
]
