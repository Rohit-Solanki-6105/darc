from django.contrib import admin
from .models import Agent, Capability, CapabilityMapper


@admin.register(Capability)
class CapabilityAdmin(admin.ModelAdmin):
    list_display = ('capability_id', 'name', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('capability_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Info', {
            'fields': ('capability_id', 'name', 'description')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(CapabilityMapper)
class CapabilityMapperAdmin(admin.ModelAdmin):
    list_display = ('capability_mapper_id', 'agent_id', 'capability_id', 'created_at')
    list_filter = ('created_at', 'capability_id')
    search_fields = ('agent_id__agent_name', 'capability_id__name')
    readonly_fields = ('capability_mapper_id', 'created_at')
    fieldsets = (
        ('Mapping', {
            'fields': ('capability_mapper_id', 'agent_id', 'capability_id')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


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

