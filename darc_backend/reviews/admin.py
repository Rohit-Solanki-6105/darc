from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('review_id', 'agent_id', 'reviewer_id', 'rating', 'verify_badge', 'helpful_count', 'created_at')
    list_filter = ('rating', 'verified_buyer', 'created_at')
    search_fields = ('title', 'comment', 'agent_id__agent_name', 'reviewer_id__email')
    readonly_fields = ('review_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Review Info', {
            'fields': ('review_id', 'agent_id', 'reviewer_id', 'rating')
        }),
        ('Content', {
            'fields': ('title', 'comment')
        }),
        ('Meta', {
            'fields': ('verified_buyer', 'helpful_count')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def verify_badge(self, obj):
        return "✓ Verified" if obj.verified_buyer else "Not Verified"
    verify_badge.short_description = "Buyer Status"

