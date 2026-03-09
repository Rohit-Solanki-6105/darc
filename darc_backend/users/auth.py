from rest_framework.authentication import TokenAuthentication as DRFTokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import AuthToken


class CustomTokenAuthentication(DRFTokenAuthentication):
    """Custom token authentication using our custom AuthToken model"""
    
    def get_model(self):
        return AuthToken
    
    def authenticate_credentials(self, key):
        try:
            token = AuthToken.objects.get(key=key)
        except AuthToken.DoesNotExist:
            raise AuthenticationFailed('Invalid token.')
        
        if not token.user.is_active:
            raise AuthenticationFailed('User inactive or deleted.')
        
        return (token.user, token)
