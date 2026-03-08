from rest_framework import serializers
from .models import Review
from users.serializers import UserSerializer


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    reviewer = UserSerializer(source='reviewer_id', read_only=True)
    agent_name = serializers.CharField(source='agent_id.agent_name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'review_id', 'agent_id', 'agent_name', 'reviewer', 'rating',
            'title', 'comment', 'verified_buyer', 'helpful_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['review_id', 'created_at', 'updated_at']


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new reviews"""
    
    class Meta:
        model = Review
        fields = ['agent_id', 'rating', 'title', 'comment']
    
    def validate_rating(self, value):
        from decimal import Decimal
        if value < Decimal('0.0') or value > Decimal('5.0'):
            raise serializers.ValidationError("Rating must be between 0 and 5")
        return value
    
    def create(self, validated_data):
        validated_data['reviewer_id_id'] = self.context['request'].user.id
        return super().create(validated_data)


class ReviewUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating reviews"""
    
    class Meta:
        model = Review
        fields = ['rating', 'title', 'comment']


class ReviewListSerializer(serializers.ModelSerializer):
    """Serializer for listing reviews"""
    reviewer_name = serializers.CharField(source='reviewer_id.full_name', read_only=True)
    agent_name = serializers.CharField(source='agent_id.agent_name', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'review_id', 'agent_id', 'agent_name', 'reviewer_name',
            'rating', 'title', 'verified_buyer', 'helpful_count',
            'created_at'
        ]
