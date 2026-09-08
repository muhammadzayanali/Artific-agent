from django.db import models

from accounts.models import Organization


class Agent(models.Model):
    class Mode(models.TextChoices):
        VOICE = "voice", "Voice"
        VOICE_CHAT = "voice_chat", "Voice + Chat"
        CHAT = "chat", "Chat"

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        PAUSED = "paused", "Paused"
        SETUP = "setup", "In setup"

    organization = models.ForeignKey(
        Organization, related_name="agents", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=120)
    mode = models.CharField(max_length=20, choices=Mode.choices, default=Mode.VOICE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SETUP)
    main_goal = models.TextField(blank=True)
    greeting = models.TextField(
        blank=True,
        help_text="Açılış karşılama cümlesi (sesli asistanın ilk söylediği metin).",
    )
    instructions = models.TextField(
        blank=True,
        help_text="Ajan davranış kuralları / sistem talimatları.",
    )
    voice_label = models.CharField(max_length=80, blank=True, default="Türkçe · Doğal")
    speaking_style = models.CharField(max_length=80, blank=True, default="Sıcak ve profesyonel")
    voice_sample = models.FileField(upload_to="voice_samples/", blank=True, null=True)
    tools_enabled = models.JSONField(
        default=list,
        blank=True,
        help_text="Aktif araçlar: knowledge, transfer, appointment, whatsapp, price_lookup",
    )
    languages = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class PhoneLine(models.Model):
    agent = models.ForeignKey(Agent, related_name="lines", on_delete=models.CASCADE)
    label = models.CharField(max_length=80, blank=True)
    number = models.CharField(max_length=32)
    is_primary = models.BooleanField(default=True)

    class Meta:
        ordering = ["-is_primary", "id"]

    def __str__(self):
        return self.number
