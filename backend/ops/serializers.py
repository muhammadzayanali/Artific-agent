from rest_framework import serializers

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


class OrganizationProfileSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source="organization.name", read_only=True)
    organization_id = serializers.IntegerField(source="organization.id", read_only=True)

    class Meta:
        model = OrganizationProfile
        fields = (
            "organization_id",
            "organization_name",
            "authorized_name",
            "mobile_phone",
            "ai_line",
            "email",
            "external_agent_id",
            "remaining_minutes",
            "gold_price_source",
            "language",
            "is_active",
            "registered_at",
        )


class KnowledgeEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeEntry
        fields = (
            "id",
            "category",
            "title",
            "content",
            "tags",
            "priority",
            "status",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class StaffMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffMember
        fields = (
            "id",
            "name",
            "title",
            "phone",
            "specialty",
            "availability",
            "created_at",
        )
        read_only_fields = ("id", "created_at")


class ServiceRequestSerializer(serializers.ModelSerializer):
    assignee_name = serializers.CharField(source="assignee.name", read_only=True, default=None)

    class Meta:
        model = ServiceRequest
        fields = (
            "id",
            "title",
            "description",
            "category",
            "priority",
            "status",
            "phone",
            "assignee",
            "assignee_name",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "assignee_name")


class CampaignContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignContact
        fields = ("id", "name", "phone", "source", "call_status")


class CampaignSerializer(serializers.ModelSerializer):
    contacts = CampaignContactSerializer(many=True, read_only=True)
    agent_name = serializers.CharField(source="agent.name", read_only=True, default=None)
    total_targets = serializers.IntegerField(read_only=True)
    called_count = serializers.IntegerField(read_only=True)
    success_count = serializers.IntegerField(read_only=True)
    failed_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Campaign
        fields = (
            "id",
            "name",
            "agent",
            "agent_name",
            "line_label",
            "message",
            "status",
            "contacts",
            "total_targets",
            "called_count",
            "success_count",
            "failed_count",
            "created_at",
        )


class WhatsAppMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhatsAppMessage
        fields = ("id", "customer_number", "preview", "occurred_at")


class CompetitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competitor
        fields = (
            "id",
            "name",
            "address",
            "rating",
            "review_count",
            "notes",
            "created_at",
        )


class AnalysisReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisReport
        fields = ("id", "title", "summary", "recommendations", "created_at")


class DashboardSerializer(serializers.Serializer):
    calls_today = serializers.IntegerField()
    remaining_minutes = serializers.FloatField()
    potential_leads = serializers.IntegerField()
    transfer_requests = serializers.IntegerField()
    pending_requests = serializers.IntegerField()
    total_talk_time = serializers.CharField()
    active_calls = serializers.IntegerField()
    total_calls = serializers.IntegerField()
    weekly = serializers.ListField()
    recent_calls = serializers.ListField()
    recent_transfers = serializers.ListField()
    ai_line = serializers.CharField()
    language = serializers.CharField()
    assistant_active = serializers.BooleanField()
