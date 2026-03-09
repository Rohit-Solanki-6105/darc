from django.contrib import admin
from .models import User, AuthToken


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


@admin.register(AuthToken)
class AuthTokenAdmin(admin.ModelAdmin):
    list_display = ('key', 'user', 'created')
    list_filter = ('created',)
    search_fields = ('user__email', 'key')
    readonly_fields = ('key', 'created')


