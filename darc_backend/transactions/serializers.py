from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for Transaction model"""
    agent_name = serializers.CharField(source='agent_id.agent_name', read_only=True)
    developer_name = serializers.CharField(source='developer_id.full_name', read_only=True)
    client_name = serializers.CharField(source='client_id.full_name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'transaction_id', 'agent_id', 'agent_name', 'developer_id',
            'developer_name', 'client_id', 'client_name', 'amount',
            'platform_fee', 'developer_amount', 'tx_hash', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['transaction_id', 'created_at', 'updated_at']


class TransactionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new transactions"""
    
    class Meta:
        model = Transaction
        fields = [
            'agent_id', 'developer_id', 'client_id', 'amount',
            'platform_fee', 'tx_hash'
        ]
    
    def validate_amount(self, value):
        from decimal import Decimal
        if value <= Decimal('0.00000000'):
            raise serializers.ValidationError("Amount must be greater than zero")
        return value


class TransactionListSerializer(serializers.ModelSerializer):
    """Serializer for listing transactions"""
    agent_name = serializers.CharField(source='agent_id.agent_name', read_only=True)
    client_name = serializers.CharField(source='client_id.full_name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'transaction_id', 'agent_id', 'agent_name', 'client_id',
            'client_name', 'amount', 'tx_hash', 'created_at'
        ]


class TransactionDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed transaction information"""
    agent_name = serializers.CharField(source='agent_id.agent_name', read_only=True)
    developer_name = serializers.CharField(source='developer_id.full_name', read_only=True)
    client_name = serializers.CharField(source='client_id.full_name', read_only=True)
    total_fees = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = [
            'transaction_id', 'agent_id', 'agent_name', 'developer_id',
            'developer_name', 'client_id', 'client_name', 'amount',
            'platform_fee', 'developer_amount', 'total_fees', 'tx_hash',
            'created_at', 'updated_at'
        ]
    
    def get_total_fees(self, obj):
        if obj.platform_fee:
            return obj.platform_fee
        return None
