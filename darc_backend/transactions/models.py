from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Transaction(models.Model):
    """Transaction model for DARC platform"""
    
    transaction_id = models.AutoField(primary_key=True)
    agent_id = models.ForeignKey(
        'agents.Agent',
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    developer_id = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='developer_transactions'
    )
    client_id = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='client_transactions'
    )
    amount = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        validators=[MinValueValidator(Decimal('0.00000001'))]
    )
    platform_fee = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00000000'))]
    )
    developer_amount = models.DecimalField(
        max_digits=18,
        decimal_places=8,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00000000'))]
    )
    tx_hash = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        unique=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'transactions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['agent_id']),
            models.Index(fields=['developer_id']),
            models.Index(fields=['client_id']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Transaction {self.transaction_id} - {self.amount} for Agent {self.agent_id}"
    
    def save(self, *args, **kwargs):
        """Calculate developer amount if not provided"""
        if self.platform_fee and not self.developer_amount:
            self.developer_amount = self.amount - self.platform_fee
        super().save(*args, **kwargs)
