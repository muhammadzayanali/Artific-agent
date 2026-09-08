from django.db import models

from accounts.models import Organization
from agents.models import Agent


class OrganizationProfile(models.Model):
    organization = models.OneToOneField(
        Organization, related_name="profile", on_delete=models.CASCADE
    )
    authorized_name = models.CharField(max_length=120, blank=True)
    mobile_phone = models.CharField(max_length=32, blank=True)
    ai_line = models.CharField(max_length=32, blank=True)
    email = models.EmailField(blank=True)
    external_agent_id = models.CharField(max_length=120, blank=True)
    remaining_minutes = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    gold_price_source = models.CharField(max_length=200, blank=True)
    language = models.CharField(max_length=40, default="Türkçe")
    is_active = models.BooleanField(default=True)
    registered_at = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Profile · {self.organization.name}"


class KnowledgeEntry(models.Model):
    class Status(models.TextChoices):
        LIVE = "live", "Yayında"
        PENDING = "pending", "Onay bekliyor"
        DRAFT = "draft", "Taslak"

    organization = models.ForeignKey(
        Organization, related_name="knowledge_entries", on_delete=models.CASCADE
    )
    category = models.CharField(max_length=80)
    title = models.CharField(max_length=200)
    content = models.TextField()
    tags = models.CharField(max_length=300, blank=True)
    priority = models.PositiveSmallIntegerField(default=5)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["priority", "-updated_at"]


class StaffMember(models.Model):
    class Availability(models.TextChoices):
        AVAILABLE = "available", "Müsait"
        BUSY = "busy", "Meşgul"
        OFFLINE = "offline", "Çevrimdışı"

    organization = models.ForeignKey(
        Organization, related_name="staff_members", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=120)
    title = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=32)
    specialty = models.CharField(max_length=160, blank=True)
    availability = models.CharField(
        max_length=20, choices=Availability.choices, default=Availability.AVAILABLE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]


class ServiceRequest(models.Model):
    class Category(models.TextChoices):
        PRICE = "price", "Fiyat sorusu"
        RESERVATION = "reservation", "Rezervasyon"
        COMPLAINT = "complaint", "Şikayet"
        CALLBACK = "callback", "Geri arama"
        QUOTE = "quote", "Teklif"
        INFO = "info", "Bilgi talebi"
        OTHER = "other", "Diğer"

    class Priority(models.TextChoices):
        LOW = "low", "Düşük"
        MEDIUM = "medium", "Orta"
        HIGH = "high", "Yüksek"

    class Status(models.TextChoices):
        NEW = "new", "Yeni"
        IN_PROGRESS = "in_progress", "İşlemde"
        COMPLETED = "completed", "Tamamlandı"
        CANCELLED = "cancelled", "İptal"

    organization = models.ForeignKey(
        Organization, related_name="service_requests", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=Category.choices)
    priority = models.CharField(
        max_length=20, choices=Priority.choices, default=Priority.MEDIUM
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    phone = models.CharField(max_length=32, blank=True)
    assignee = models.ForeignKey(
        StaffMember,
        related_name="requests",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]


class Campaign(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Taslak"
        RUNNING = "running", "Çalışıyor"
        PAUSED = "paused", "Duraklatıldı"
        DONE = "done", "Tamamlandı"

    organization = models.ForeignKey(
        Organization, related_name="campaigns", on_delete=models.CASCADE
    )
    agent = models.ForeignKey(
        Agent, related_name="campaigns", null=True, blank=True, on_delete=models.SET_NULL
    )
    name = models.CharField(max_length=160)
    line_label = models.CharField(max_length=120, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class CampaignContact(models.Model):
    class CallStatus(models.TextChoices):
        WAITING = "waiting", "Bekliyor"
        CALLED = "called", "Arandı"
        SUCCESS = "success", "Başarılı"
        FAILED = "failed", "Hatalı"

    campaign = models.ForeignKey(
        Campaign, related_name="contacts", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=32)
    source = models.CharField(max_length=80, blank=True)
    call_status = models.CharField(
        max_length=20, choices=CallStatus.choices, default=CallStatus.WAITING
    )


class WhatsAppMessage(models.Model):
    organization = models.ForeignKey(
        Organization, related_name="whatsapp_messages", on_delete=models.CASCADE
    )
    customer_number = models.CharField(max_length=32)
    preview = models.TextField()
    occurred_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-occurred_at"]


class Competitor(models.Model):
    organization = models.ForeignKey(
        Organization, related_name="competitors", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=160)
    address = models.CharField(max_length=255, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    review_count = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]


class AnalysisReport(models.Model):
    organization = models.ForeignKey(
        Organization, related_name="analysis_reports", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)
    summary = models.TextField()
    recommendations = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
