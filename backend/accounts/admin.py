from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'username', 'is_admin', 'is_active')
    search_fields = ('email', 'username')
    list_filter = ('is_admin', 'is_active')
