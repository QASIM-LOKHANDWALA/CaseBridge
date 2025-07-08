from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status
from users.models import User
from users.utils import generate_jwt

class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                raise ValueError()
        except (User.DoesNotExist, ValueError):
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        token = generate_jwt(user)

        return Response({
            "token": token,
            "role": user.role,
            "email": user.email,
        }, status=status.HTTP_200_OK)
