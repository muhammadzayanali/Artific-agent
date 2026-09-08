from django.contrib import admin

from .models import (
    AnalysisReport,
    Campaign,
    CampaignContact,
    Competitor,
    KnowledgeEntry,
    OrganizationProfile,
    ServiceRequest,
    StaffMember,
    WhatsAppMessage,
)


@admin.register(OrganizationProfile)
class OrganizationProfileAdmin(admin.ModelAdmin):
    list_display = ("organization", "ai_line", "remaining_minutes", "is_active")


@admin.register(KnowledgeEntry)
class KnowledgeEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "organization")


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "title", "availability", "organization")


@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "priority", "organization")


class CampaignContactInline(admin.TabularInline):
    model = CampaignContact
    extra = 0


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ("name", "status", "organization")
    inlines = [CampaignContactInline]


@admin.register(WhatsAppMessage)
class WhatsAppMessageAdmin(admin.ModelAdmin):
    list_display = ("customer_number", "occurred_at", "organization")


@admin.register(Competitor)
class CompetitorAdmin(admin.ModelAdmin):
    list_display = ("name", "rating", "organization")


@admin.register(AnalysisReport)
class AnalysisReportAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at", "organization")
