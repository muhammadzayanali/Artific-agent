from rest_framework import serializers

from .models import Agent, PhoneLine


class PhoneLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneLine
        fields = ("id", "label", "number", "is_primary")


class AgentSerializer(serializers.ModelSerializer):
    lines = PhoneLineSerializer(many=True, read_only=True)
    last_call_at = serializers.DateTimeField(read_only=True, allow_null=True)
    live_call_count = serializers.IntegerField(read_only=True)
    voice_sample_url = serializers.SerializerMethodField()

    class Meta:
        model = Agent
        fields = (
            "id",
            "name",
            "mode",
            "status",
            "main_goal",
            "greeting",
            "instructions",
            "voice_label",
            "speaking_style",
            "voice_sample",
            "voice_sample_url",
            "tools_enabled",
            "languages",
            "lines",
            "last_call_at",
            "live_call_count",
            "last_synced_at",
            "last_sync_ok",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "voice_sample",
            "updated_at",
            "last_call_at",
            "live_call_count",
            "last_synced_at",
            "last_sync_ok",
        )

    def get_voice_sample_url(self, obj):
        if not obj.voice_sample:
            return None
        request = self.context.get("request")
        url = obj.voice_sample.url
        if request is not None:
            return request.build_absolute_uri(url)
        return url
