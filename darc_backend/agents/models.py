from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import json


class Agent(models.Model):
    """Agent model for DARC platform"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    agent_id = models.AutoField(primary_key=True)
    developer_id = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='created_agents'
    )
    agent_name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    task_fees = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00000000'))]
    )
    agent_price = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00000000'))]
    )
    subscription_fee = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00000000'))]
    )
    rating = models.DecimalField(
        max_digits=10,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[
            MinValueValidator(Decimal('0.00000000')),
            MaxValueValidator(Decimal('5.00000000'))
        ]
    )
    subscription_duration_days = models.IntegerField(default=30)
    agent_template = models.JSONField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'agents'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['developer_id']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.agent_name} by {self.developer_id.full_name}"
