from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'is_developer', 'status', 'created_at')
    list_filter = ('is_developer', 'status', 'email_verified', 'created_at')
    search_fields = ('first_name', 'last_name', 'email')
    readonly_fields = ('id', 'created_at', 'updated_at')
    fieldsets = (
        ('Personal Info', {
            'fields': ('first_name', 'last_name', 'email', 'mobile')
        }),
        ('Account Info', {
            'fields': ('is_developer', 'status', 'email_verified')
        }),
        ('Financial', {
            'fields': ('total_earning',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

