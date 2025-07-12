from django.urls import path
from . import views

urlpatterns = [
    path('start/', views.StartConversationView.as_view(), name='start-conversation'),
    path('conversations/<int:conversation_id>/messages/', views.MessageListView.as_view(), name='message-list'),
    path('conversations/<int:conversation_id>/send/', views.SendMessageView.as_view(), name='send-message'),
]
