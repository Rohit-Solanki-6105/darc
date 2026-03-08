from django.contrib import admin
from .models import Agent


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('agent_id', 'agent_name', 'developer_id', 'status', 'agent_price', 'rating', 'created_at')
    list_filter = ('status', 'created_at', 'rating')
    search_fields = ('agent_name', 'description', 'developer_id__email')
    readonly_fields = ('agent_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Basic Info', {
            'fields': ('agent_id', 'agent_name', 'description', 'developer_id')
        }),
        ('Pricing', {
            'fields': ('task_fees', 'agent_price', 'subscription_fee', 'subscription_duration_days')
        }),
        ('Status & Rating', {
            'fields': ('status', 'rating')
        }),
        ('Template', {
            'fields': ('agent_template',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

