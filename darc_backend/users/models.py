from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.core.validators import EmailValidator
from decimal import Decimal
import secrets


class User(models.Model):
    """User model for DARC platform"""
    
    STATUS_CHOICES = [
        ('allowed', 'Allowed'),
        ('warning', 'Warning'),
        ('blocked', 'Blocked'),
    ]
    
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, validators=[EmailValidator()])
    email_verified = models.BooleanField(default=False)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    password_hash = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='allowed'
    )
    is_developer = models.BooleanField(default=False)
    total_earning = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        default=Decimal('0.00000000')
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['is_developer']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def set_password(self, raw_password):
        """Hash password"""
        self.password_hash = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verify password"""
        return check_password(raw_password, self.password_hash)


class AuthToken(models.Model):
    """Custom authentication token model for User"""
    key = models.CharField(("Key"), max_length=40, primary_key=True)
    user = models.OneToOneField(User, related_name="auth_token", on_delete=models.CASCADE)
    created = models.DateTimeField(("Created"), auto_now_add=True)

    class Meta:
        verbose_name = "Auth Token"
        db_table = 'users_authtoken'

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    @staticmethod
    def generate_key():
        return secrets.token_hex(20)

    def __str__(self):
        return self.key
