from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum, Q
from decimal import Decimal
from .models import Transaction
from .serializers import (
    TransactionSerializer,
    TransactionCreateSerializer,
    TransactionListSerializer,
    TransactionDetailSerializer
)


class TransactionViewSet(viewsets.ModelViewSet):
    """ViewSet for Transaction model operations"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['agent_id', 'developer_id', 'client_id']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return TransactionCreateSerializer
        elif self.action == 'list':
            return TransactionListSerializer
        elif self.action == 'retrieve':
            return TransactionDetailSerializer
        return TransactionSerializer
    
    def create(self, request, *args, **kwargs):
        """Create new transaction"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Transactions cannot be updated after creation"""
        return Response(
            {'error': 'Transactions cannot be updated'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    def partial_update(self, request, *args, **kwargs):
        """Transactions cannot be updated after creation"""
        return Response(
            {'error': 'Transactions cannot be updated'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    def destroy(self, request, *args, **kwargs):
        """Transactions cannot be deleted"""
        return Response(
            {'error': 'Transactions cannot be deleted'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    @action(detail=False, methods=['get'])
    def developer_transactions(self, request):
        """Get all transactions for a developer"""
        developer_id = request.query_params.get('developer_id')
        if not developer_id:
            return Response(
                {'error': 'developer_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transactions = Transaction.objects.filter(developer_id=developer_id)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def client_transactions(self, request):
        """Get all transactions for a client"""
        client_id = request.query_params.get('client_id')
        if not client_id:
            return Response(
                {'error': 'client_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transactions = Transaction.objects.filter(client_id=client_id)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def agent_transactions(self, request):
        """Get all transactions for an agent"""
        agent_id = request.query_params.get('agent_id')
        if not agent_id:
            return Response(
                {'error': 'agent_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        transactions = Transaction.objects.filter(agent_id=agent_id)
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get transaction summary"""
        dev_id = request.query_params.get('developer_id')
        
        if dev_id:
            transactions = Transaction.objects.filter(developer_id=dev_id)
        else:
            transactions = Transaction.objects.all()
        
        total_amount = transactions.aggregate(Sum('amount'))['amount__sum'] or Decimal('0')
        total_platform_fee = transactions.aggregate(Sum('platform_fee'))['platform_fee__sum'] or Decimal('0')
        total_developer_amount = transactions.aggregate(Sum('developer_amount'))['developer_amount__sum'] or Decimal('0')
        
        return Response({
            'total_transactions': transactions.count(),
            'total_amount': str(total_amount),
            'total_platform_fee': str(total_platform_fee),
            'total_developer_amount': str(total_developer_amount)
        })

