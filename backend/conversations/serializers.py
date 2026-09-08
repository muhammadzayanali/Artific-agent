from rest_framework import serializers

from .models import Conversation, TranscriptTurn


class TranscriptTurnSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptTurn
        fields = ("id", "speaker", "text", "started_offset_seconds")


class ConversationListSerializer(serializers.ModelSerializer):
    agent_name = serializers.CharField(source="agent.name", read_only=True)

    class Meta:
        model = Conversation
        fields = (
            "id",
            "agent",
            "agent_name",
            "direction",
            "status",
            "outcome",
            "caller_name",
            "caller_number",
            "started_at",
            "ended_at",
            "duration_seconds",
            "summary",
            "detected_need",
        )


class ConversationDetailSerializer(ConversationListSerializer):
    turns = TranscriptTurnSerializer(many=True, read_only=True)
    action_taken = serializers.CharField(read_only=True)
    recording_url = serializers.CharField(read_only=True)

    class Meta(ConversationListSerializer.Meta):
        fields = ConversationListSerializer.Meta.fields + (
            "action_taken",
            "recording_url",
            "turns",
        )
