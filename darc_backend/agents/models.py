from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal
import json


class Capability(models.Model):
    """Capability model for agent capabilities"""
    
    capability_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'capabilities'
        ordering = ['name']
    
    def __str__(self):
        return self.name


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
    output_template = models.JSONField(null=True, blank=True)
    api_endpoint = models.URLField(null=True, blank=True)
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


class CapabilityMapper(models.Model):
    """Mapping table for agent capabilities"""
    
    capability_mapper_id = models.AutoField(primary_key=True)
    agent_id = models.ForeignKey(
        Agent,
        on_delete=models.CASCADE,
        related_name='capabilities_rel'
    )
    capability_id = models.ForeignKey(
        Capability,
        on_delete=models.CASCADE,
        related_name='agents_rel'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cap_mapper'
        ordering = ['created_at']
        unique_together = ('agent_id', 'capability_id')
    
    def __str__(self):
        return f"{self.agent_id.agent_name} - {self.capability_id.name}"
