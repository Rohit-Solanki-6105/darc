from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'agent_id', 'client_id', 'amount', 'developer_amount', 'created_at')
    list_filter = ('created_at', 'agent_id', 'developer_id', 'client_id')
    search_fields = ('agent_id__agent_name', 'tx_hash', 'client_id__email')
    readonly_fields = ('transaction_id', 'created_at', 'updated_at')
    fieldsets = (
        ('Transaction Info', {
            'fields': ('transaction_id', 'agent_id', 'developer_id', 'client_id')
        }),
        ('Amount Details', {
            'fields': ('amount', 'platform_fee', 'developer_amount')
        }),
        ('Blockchain', {
            'fields': ('tx_hash',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

