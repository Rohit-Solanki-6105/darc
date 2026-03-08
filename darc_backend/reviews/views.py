from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg
from .models import Review
from .serializers import (
    ReviewSerializer,
    ReviewCreateSerializer,
    ReviewUpdateSerializer,
    ReviewListSerializer
)


class ReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for Review model operations"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['agent_id', 'reviewer_id', 'rating']
    ordering_fields = ['created_at', 'rating', 'helpful_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return ReviewUpdateSerializer
        elif self.action == 'list':
            return ReviewListSerializer
        return ReviewSerializer
    
    def create(self, request, *args, **kwargs):
        """Create new review"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = serializer.save()
        
        # Update agent rating
        self.update_agent_rating(review.agent_id)
        
        return Response(
            ReviewSerializer(review).data,
            status=status.HTTP_201_CREATED
        )
    
    def update(self, request, *args, **kwargs):
        """Update review"""
        review = self.get_object()
        if review.reviewer_id.id != request.user.id:
            return Response(
                {'error': 'You can only update your own reviews'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Delete review"""
        review = self.get_object()
        if review.reviewer_id.id != request.user.id:
            return Response(
                {'error': 'You can only delete your own reviews'},
                status=status.HTTP_403_FORBIDDEN
            )
        agent_id = review.agent_id
        response = super().destroy(request, *args, **kwargs)
        self.update_agent_rating(agent_id)
        return response
    
    @action(detail=False, methods=['get'])
    def agent_reviews(self, request):
        """Get all reviews for an agent"""
        agent_id = request.query_params.get('agent_id')
        if not agent_id:
            return Response(
                {'error': 'agent_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = Review.objects.filter(agent_id=agent_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def agent_statistics(self, request):
        """Get review statistics for an agent"""
        agent_id = request.query_params.get('agent_id')
        if not agent_id:
            return Response(
                {'error': 'agent_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = Review.objects.filter(agent_id=agent_id)
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        
        # Count reviews by rating
        rating_distribution = {}
        for i in range(1, 6):
            count = reviews.filter(rating=i).count()
            rating_distribution[f'{i}.0'] = count
        
        return Response({
            'agent_id': agent_id,
            'average_rating': avg_rating,
            'total_reviews': reviews.count(),
            'verified_reviews': reviews.filter(verified_buyer=True).count(),
            'rating_distribution': rating_distribution
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def mark_helpful(self, request, pk=None):
        """Mark review as helpful"""
        review = self.get_object()
        review.helpful_count += 1
        review.save()
        return Response(
            {'message': 'Review marked as helpful', 'helpful_count': review.helpful_count},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'])
    def user_reviews(self, request):
        """Get all reviews by a user"""
        reviewer_id = request.query_params.get('reviewer_id')
        if not reviewer_id:
            return Response(
                {'error': 'reviewer_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reviews = Review.objects.filter(reviewer_id=reviewer_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)
    
    @staticmethod
    def update_agent_rating(agent):
        """Update agent rating based on reviews"""
        from agents.models import Agent
        reviews = Review.objects.filter(agent_id=agent)
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        if avg_rating:
            agent_obj = Agent.objects.get(agent_id=agent.agent_id)
            agent_obj.rating = avg_rating
            agent_obj.save()

