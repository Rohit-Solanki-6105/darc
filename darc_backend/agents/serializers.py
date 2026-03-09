from rest_framework import serializers
from .models import Agent, Capability, CapabilityMapper
from users.serializers import UserSerializer


class CapabilitySerializer(serializers.ModelSerializer):
    """Serializer for Capability model"""
    
    class Meta:
        model = Capability
        fields = ['capability_id', 'name', 'description']


class CapabilityMapperSerializer(serializers.ModelSerializer):
    """Serializer for CapabilityMapper"""
    capability = CapabilitySerializer(source='capability_id', read_only=True)
    
    class Meta:
        model = CapabilityMapper
        fields = ['capability_mapper_id', 'capability']


class AgentSerializer(serializers.ModelSerializer):
    """Serializer for Agent model"""
    developer = UserSerializer(source='developer_id', read_only=True)
    capabilities = serializers.SerializerMethodField()
    
    class Meta:
        model = Agent
        fields = [
            'agent_id', 'developer', 'agent_name', 'description',
            'task_fees', 'agent_price', 'subscription_fee', 'rating',
            'subscription_duration_days', 'agent_template', 'output_template', 'api_endpoint', 'status', 
            'capabilities', 'created_at', 'updated_at'
        ]
        read_only_fields = ['agent_id', 'created_at', 'updated_at']
    
    def get_capabilities(self, obj):
        """Get all capabilities for this agent"""
        capabilities = obj.capabilities_rel.all()
        return CapabilitySerializer([cap.capability_id for cap in capabilities], many=True).data


class AgentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new agents"""
    capabilities = serializers.PrimaryKeyRelatedField(
        queryset=Capability.objects.all(),
        many=True,
        required=False
    )
    
    class Meta:
        model = Agent
        fields = [
            'agent_name', 'description', 'task_fees', 'agent_price',
            'subscription_fee', 'subscription_duration_days', 'agent_template',
            'output_template', 'api_endpoint', 'capabilities'
        ]
    
    def create(self, validated_data):
        capabilities = validated_data.pop('capabilities', [])
        validated_data['developer_id_id'] = self.context['request'].user.id
        agent = super().create(validated_data)
        
        # Add capabilities to agent
        for capability in capabilities:
            CapabilityMapper.objects.get_or_create(
                agent_id=agent,
                capability_id=capability
            )
        
        return agent


class AgentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating agent information"""
    capabilities = serializers.PrimaryKeyRelatedField(
        queryset=Capability.objects.all(),
        many=True,
        required=False
    )
    
    class Meta:
        model = Agent
        fields = [
            'agent_name', 'description', 'task_fees', 'agent_price',
            'subscription_fee', 'subscription_duration_days', 'agent_template',
            'output_template', 'api_endpoint', 'capabilities'
        ]
    
    def update(self, instance, validated_data):
        capabilities = validated_data.pop('capabilities', None)
        
        # Update agent fields
        instance = super().update(instance, validated_data)
        
        # Update capabilities if provided
        if capabilities is not None:
            # Clear existing capabilities
            instance.capabilities_rel.all().delete()
            # Add new capabilities
            for capability in capabilities:
                CapabilityMapper.objects.get_or_create(
                    agent_id=instance,
                    capability_id=capability
                )
        
        return instance


class AgentListSerializer(serializers.ModelSerializer):
    """Serializer for listing agents with minimal information"""
    developer_name = serializers.CharField(source='developer_id.full_name', read_only=True)
    capabilities = serializers.SerializerMethodField()
    
    class Meta:
        model = Agent
        fields = [
            'agent_id', 'agent_name', 'developer_name', 'agent_price',
            'rating', 'status', 'capabilities', 'created_at', 'api_endpoint'
        ]
    
    def get_capabilities(self, obj):
        """Get capability names for this agent"""
        capabilities = obj.capabilities_rel.all()
        return [cap.capability_id.name for cap in capabilities]
