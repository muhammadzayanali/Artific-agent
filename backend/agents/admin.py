from django.contrib import admin

from .models import Agent, PhoneLine


class PhoneLineInline(admin.TabularInline):
    model = PhoneLine
    extra = 0


@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ("name", "organization", "mode", "status")
    list_filter = ("status", "mode")
    inlines = [PhoneLineInline]
