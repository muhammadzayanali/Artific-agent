from django.db import models

from accounts.models import Organization
from agents.models import Agent


class Conversation(models.Model):
    class Direction(models.TextChoices):
        INBOUND = "inbound", "Inbound"
        OUTBOUND = "outbound", "Outbound"

    class Status(models.TextChoices):
        LIVE = "live", "Live"
        ENDED = "ended", "Ended"
        MISSED = "missed", "Missed"
        FAILED = "failed", "Failed"

    class Outcome(models.TextChoices):
        APPOINTMENT = "appointment", "Appointment created"
        INFORMATION = "information", "Information provided"
        HANDOFF = "handoff", "Handed to team"
        FOLLOW_UP = "follow_up", "Follow-up needed"
        MISSED = "missed", "Missed"
        IN_PROGRESS = "in_progress", "In progress"

    organization = models.ForeignKey(
        Organization, related_name="conversations", on_delete=models.CASCADE
    )
    agent = models.ForeignKey(
        Agent, related_name="conversations", on_delete=models.CASCADE
    )
    direction = models.CharField(max_length=16, choices=Direction.choices)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.ENDED)
    outcome = models.CharField(
        max_length=20, choices=Outcome.choices, default=Outcome.INFORMATION
    )
    caller_name = models.CharField(max_length=120, blank=True)
    caller_number = models.CharField(max_length=32)
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    summary = models.TextField(blank=True)
    detected_need = models.CharField(max_length=200, blank=True)
    action_taken = models.CharField(max_length=200, blank=True)
    recording_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.caller_number} · {self.status}"


class TranscriptTurn(models.Model):
    class Speaker(models.TextChoices):
        AGENT = "agent", "Agent"
        CALLER = "caller", "Caller"

    conversation = models.ForeignKey(
        Conversation, related_name="turns", on_delete=models.CASCADE
    )
    speaker = models.CharField(max_length=16, choices=Speaker.choices)
    text = models.TextField()
    started_offset_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["started_offset_seconds", "id"]
