from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


class Review(models.Model):
    """Review model for DARC agents"""
    
    review_id = models.AutoField(primary_key=True)
    agent_id = models.ForeignKey(
        'agents.Agent',
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    reviewer_id = models.ForeignKey(
        'users.User',
        on_delete=models.CASCADE,
        related_name='reviews_given'
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        validators=[
            MinValueValidator(Decimal('0.0')),
            MaxValueValidator(Decimal('5.0'))
        ]
    )
    title = models.CharField(max_length=200)
    comment = models.TextField()
    verified_buyer = models.BooleanField(default=False)
    helpful_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['agent_id']),
            models.Index(fields=['reviewer_id']),
            models.Index(fields=['rating']),
            models.Index(fields=['created_at']),
        ]
        unique_together = ['agent_id', 'reviewer_id']
    
    def __str__(self):
        return f"Review by {self.reviewer_id.full_name} for Agent {self.agent_id.agent_name}"
