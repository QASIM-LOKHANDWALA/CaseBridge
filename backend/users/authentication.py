# users/authentication.py
from rest_framework.authentication import BaseAuthentication
from users.utils import decode_jwt

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]
        user = decode_jwt(token)
        return (user, None)