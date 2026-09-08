from django.contrib import admin

from .models import Conversation, TranscriptTurn


class TranscriptTurnInline(admin.TabularInline):
    model = TranscriptTurn
    extra = 0


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "caller_number",
        "agent",
        "status",
        "direction",
        "started_at",
    )
    list_filter = ("status", "direction", "outcome")
    inlines = [TranscriptTurnInline]
