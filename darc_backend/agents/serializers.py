from rest_framework import serializers
from .models import Agent
from users.serializers import UserSerializer


class AgentSerializer(serializers.ModelSerializer):
    """Serializer for Agent model"""
    developer = UserSerializer(source='developer_id', read_only=True)
    
    class Meta:
        model = Agent
        fields = [
            'agent_id', 'developer', 'agent_name', 'description',
            'task_fees', 'agent_price', 'subscription_fee', 'rating',
            'subscription_duration_days', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['agent_id', 'created_at', 'updated_at']


class AgentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new agents"""
    
    class Meta:
        model = Agent
        fields = [
            'agent_name', 'description', 'task_fees', 'agent_price',
            'subscription_fee', 'subscription_duration_days', 'agent_template'
        ]
    
    def create(self, validated_data):
        validated_data['developer_id_id'] = self.context['request'].user.id
        return super().create(validated_data)


class AgentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating agent information"""
    
    class Meta:
        model = Agent
        fields = [
            'agent_name', 'description', 'task_fees', 'agent_price',
            'subscription_fee', 'subscription_duration_days', 'agent_template'
        ]


class AgentListSerializer(serializers.ModelSerializer):
    """Serializer for listing agents with minimal information"""
    developer_name = serializers.CharField(source='developer_id.full_name', read_only=True)
    
    class Meta:
        model = Agent
        fields = [
            'agent_id', 'agent_name', 'developer_name', 'agent_price',
            'rating', 'status', 'created_at'
        ]
