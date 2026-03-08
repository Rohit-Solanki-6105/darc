from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg, Q
from .models import Agent
from .serializers import (
    AgentSerializer,
    AgentCreateSerializer,
    AgentUpdateSerializer,
    AgentListSerializer
)


class AgentViewSet(viewsets.ModelViewSet):
    """ViewSet for Agent model operations"""
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'developer_id', 'subscription_fee']
    search_fields = ['agent_name', 'description']
    ordering_fields = ['created_at', 'rating', 'agent_price']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AgentCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return AgentUpdateSerializer
        elif self.action == 'list':
            return AgentListSerializer
        return AgentSerializer
    
    def create(self, request, *args, **kwargs):
        """Create new agent"""
        if not request.user.is_developer:
            return Response(
                {'error': 'Only developers can create agents'},
                status=status.HTTP_403_FORBIDDEN
            )
        request_data = request.data.copy()
        request_data['developer_id'] = request.user.id
        serializer = self.get_serializer(data=request_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        """Update agent"""
        agent = self.get_object()
        if agent.developer_id.id != request.user.id:
            return Response(
                {'error': 'You can only update your own agents'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Delete agent"""
        agent = self.get_object()
        if agent.developer_id.id != request.user.id:
            return Response(
                {'error': 'You can only delete your own agents'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'])
    def approved(self, request):
        """Get all approved agents"""
        agents = Agent.objects.filter(status='approved')
        serializer = self.get_serializer(agents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending agents"""
        agents = Agent.objects.filter(status='pending')
        serializer = self.get_serializer(agents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def statistics(self, request, pk=None):
        """Get agent statistics"""
        agent = self.get_object()
        reviews = agent.reviews.all()
        transactions = agent.transactions.all()
        
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        total_transactions = transactions.count()
        total_revenue = sum(t.amount for t in transactions)
        
        return Response({
            'agent_id': agent.agent_id,
            'agent_name': agent.agent_name,
            'average_rating': avg_rating,
            'total_reviews': reviews.count(),
            'total_transactions': total_transactions,
            'total_revenue': str(total_revenue)
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve agent (admin only)"""
        agent = self.get_object()
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        agent.status = 'approved'
        agent.save()
        return Response(
            {'message': 'Agent approved'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject agent (admin only)"""
        agent = self.get_object()
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        agent.status = 'rejected'
        agent.save()
        return Response(
            {'message': 'Agent rejected'},
            status=status.HTTP_200_OK
        )

