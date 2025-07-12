from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message, Conversation
from users.models import User
from .serializers import MessageSerializer
from django.utils.dateparse import parse_datetime

class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        since = request.query_params.get('since')
        messages = Message.objects.filter(conversation_id=conversation_id)
        if since:
            messages = messages.filter(timestamp__gt=parse_datetime(since))
        serialized = MessageSerializer(messages, many=True)
        return Response(serialized.data)

class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):
        text = request.data.get('text')
        if not text:
            return Response({"error": "Message text required"}, status=400)
        message = Message.objects.create(
            conversation_id=conversation_id,
            sender=request.user,
            text=text
        )
        return Response(MessageSerializer(message).data)

class StartConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user1 = request.user
        user2_id = request.data.get("participant_id")

        if not user2_id:
            return Response({"error": "Participant ID required"}, status=400)

        try:
            user2 = User.objects.get(id=user2_id)
        except User.DoesNotExist:
            return Response({"error": "Participant not found"}, status=404)

        existing_convos = Conversation.objects.filter(participants=user1).filter(participants=user2)

        for convo in existing_convos:
            if convo.participants.count() == 2:
                return Response({"conversation_id": convo.id, "message": "Conversation already exists"})

        conversation = Conversation.objects.create()
        conversation.participants.add(user1, user2)
        return Response({"conversation_id": conversation.id, "message": "New conversation started"})