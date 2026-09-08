from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from accounts.models import Organization, User
from agents.models import Agent, PhoneLine
from conversations.models import Conversation, TranscriptTurn
from ops.models import (
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


class Command(BaseCommand):
    help = "Seed Mecidiye Kuyumcu full panel demo data."

    def handle(self, *args, **options):
        org, _ = Organization.objects.get_or_create(
            name="Mecidiye Kuyumcu",
            defaults={"industry": "Kuyumculuk"},
        )
        profile, _ = OrganizationProfile.objects.update_or_create(
            organization=org,
            defaults={
                "authorized_name": "Mehmet Yıldız",
                "mobile_phone": "0532 555 0144",
                "ai_line": "+90 850 255 1465",
                "email": "vizyon@vizyon.com",
                "external_agent_id": "agent_e901k7xmecidiye",
                "remaining_minutes": Decimal("107.0"),
                "gold_price_source": "Fiyat Panosundan Otomatik Çek",
                "language": "Türkçe",
                "is_active": True,
                "registered_at": date(2024, 4, 27),
            },
        )

        user, created = User.objects.get_or_create(
            email="demo@artificagent.com",
            defaults={
                "name": "Mecidiye Yönetici",
                "organization": org,
                "role": User.Role.OWNER,
            },
        )
        if created or True:
            user.set_password("DemoPass123!")
            user.organization = org
            user.name = "Mecidiye Yönetici"
            user.role = User.Role.OWNER
            user.save()

        agent, _ = Agent.objects.update_or_create(
            organization=org,
            name="Ana Asistan",
            defaults={
                "mode": Agent.Mode.VOICE,
                "status": Agent.Status.ACTIVE,
                "main_goal": "Altın fiyatı, ürün bilgisi ve randevu taleplerini karşıla; gerektiğinde personele aktar.",
                "greeting": "Merhaba, Mecidiye Kuyumcu'ya hoş geldiniz. Size nasıl yardımcı olabilirim?",
                "instructions": (
                    "Nazik ve güven verici konuş. Fiyat sorularında bilgi bankasını kullan. "
                    "Randevu veya aktarım isterse personele yönlendir. WhatsApp özeti çıkar."
                ),
                "voice_label": "Türkçe · Doğal Kadın",
                "speaking_style": "Sıcak ve profesyonel",
                "tools_enabled": [
                    "knowledge",
                    "transfer",
                    "appointment",
                    "price_lookup",
                    "whatsapp",
                ],
                "languages": ["Türkçe"],
            },
        )
        PhoneLine.objects.get_or_create(
            agent=agent,
            number="+90 850 255 1465",
            defaults={"label": "AI Sabit Hat", "is_primary": True},
        )
        PhoneLine.objects.get_or_create(
            agent=agent,
            number="+90 312 963 0120",
            defaults={"label": "Verimor-v4", "is_primary": False},
        )

        Conversation.objects.filter(organization=org).delete()
        KnowledgeEntry.objects.filter(organization=org).delete()
        StaffMember.objects.filter(organization=org).delete()
        ServiceRequest.objects.filter(organization=org).delete()
        Campaign.objects.filter(organization=org).delete()
        WhatsAppMessage.objects.filter(organization=org).delete()
        Competitor.objects.filter(organization=org).delete()
        AnalysisReport.objects.filter(organization=org).delete()

        now = timezone.now()

        live = Conversation.objects.create(
            organization=org,
            agent=agent,
            direction=Conversation.Direction.INBOUND,
            status=Conversation.Status.LIVE,
            outcome=Conversation.Outcome.IN_PROGRESS,
            caller_name="Ayşe Kaya",
            caller_number="+90 532 111 2290",
            started_at=now - timedelta(minutes=1, seconds=20),
            duration_seconds=80,
            summary="Müşteri gram altın alış fiyatını soruyor.",
            detected_need="Altın fiyatı",
            action_taken="",
        )
        TranscriptTurn.objects.bulk_create(
            [
                TranscriptTurn(
                    conversation=live,
                    speaker=TranscriptTurn.Speaker.AGENT,
                    text="Mecidiye Kuyumcu, ben Ana Asistan. Size nasıl yardımcı olabilirim?",
                    started_offset_seconds=0,
                ),
                TranscriptTurn(
                    conversation=live,
                    speaker=TranscriptTurn.Speaker.CALLER,
                    text="Gram altın alış fiyatı nedir?",
                    started_offset_seconds=7,
                ),
                TranscriptTurn(
                    conversation=live,
                    speaker=TranscriptTurn.Speaker.AGENT,
                    text="Güncel gram altın alış fiyatını kontrol ediyorum.",
                    started_offset_seconds=14,
                ),
            ]
        )

        samples = [
            (
                Conversation.Status.ENDED,
                Conversation.Outcome.APPOINTMENT,
                "Mert Yılmaz",
                "+90 505 884 1022",
                3,
                187,
                "Müşteri cumartesi için yüzük deneme randevusu aldı.",
                "Randevu",
                "Randevu oluşturuldu",
                True,
            ),
            (
                Conversation.Status.ENDED,
                Conversation.Outcome.HANDOFF,
                "Selin Koç",
                "+90 541 220 7781",
                5,
                241,
                "Altın fiyatı ve döviz kurları hakkında detay istedi; satış danışmanına aktarıldı.",
                "Altın fiyatı",
                "Personele aktarıldı",
                True,
            ),
            (
                Conversation.Status.ENDED,
                Conversation.Outcome.FOLLOW_UP,
                "Yaşar Demir",
                "+90 533 670 4410",
                26,
                96,
                "Ücretsiz bakım kampanyası için geri arama istedi.",
                "Kampanya",
                "Geri arama talebi açıldı",
                False,
            ),
            (
                Conversation.Status.ENDED,
                Conversation.Outcome.INFORMATION,
                "Elif Aksoy",
                "+90 555 019 3301",
                30,
                42,
                "Mağaza çalışma saatleri paylaşıldı.",
                "Çalışma saatleri",
                "Bilgi verildi",
                False,
            ),
            (
                Conversation.Status.MISSED,
                Conversation.Outcome.MISSED,
                "",
                "+90 555 100 2003",
                48,
                8,
                "Arayan bağlantıyı erken kesti.",
                "",
                "",
                False,
            ),
        ]
        for status, outcome, name, number, hours_ago, dur, summary, need, action, with_turns in samples:
            c = Conversation.objects.create(
                organization=org,
                agent=agent,
                direction=Conversation.Direction.INBOUND,
                status=status,
                outcome=outcome,
                caller_name=name,
                caller_number=number,
                started_at=now - timedelta(hours=hours_ago),
                ended_at=now - timedelta(hours=hours_ago) + timedelta(seconds=dur),
                duration_seconds=dur,
                summary=summary,
                detected_need=need,
                action_taken=action,
            )
            if with_turns:
                TranscriptTurn.objects.create(
                    conversation=c,
                    speaker=TranscriptTurn.Speaker.CALLER,
                    text="Merhaba, bilgi almak istiyorum.",
                    started_offset_seconds=0,
                )
                TranscriptTurn.objects.create(
                    conversation=c,
                    speaker=TranscriptTurn.Speaker.AGENT,
                    text=summary,
                    started_offset_seconds=8,
                )

        KnowledgeEntry.objects.bulk_create(
            [
                KnowledgeEntry(
                    organization=org,
                    category="İşletme Bilgileri",
                    title="Çalışma Saatleri",
                    content="Hafta içi 09:30-19:30, Cumartesi 10:00-18:00. Pazar kapalı.",
                    tags="saat, açılış",
                    priority=1,
                    status=KnowledgeEntry.Status.LIVE,
                ),
                KnowledgeEntry(
                    organization=org,
                    category="Ürünler & Hizmetler",
                    title="Gram Altın Alış",
                    content="Gram altın alış fiyatı her sabah panodan güncellenir. Güncel fiyat için panoyu kontrol edin.",
                    tags="altın, fiyat",
                    priority=1,
                    status=KnowledgeEntry.Status.LIVE,
                ),
                KnowledgeEntry(
                    organization=org,
                    category="Kampanyalar",
                    title="Anneler Günü %10",
                    content="Seçili bileziklerde Anneler Günü'ne özel %10 indirim.",
                    tags="kampanya, anneler günü",
                    priority=2,
                    status=KnowledgeEntry.Status.PENDING,
                ),
                KnowledgeEntry(
                    organization=org,
                    category="SSS",
                    title="Ücretsiz bakım",
                    content="Satın alınan ürünlerde yıllık bir ücretsiz bakım hakkı vardır.",
                    tags="bakım, servis",
                    priority=3,
                    status=KnowledgeEntry.Status.DRAFT,
                ),
            ]
        )

        staff1 = StaffMember.objects.create(
            organization=org,
            name="Ömer Fatih Yazıcı",
            title="Satış Danışmanı",
            phone="+90 532 700 1122",
            specialty="Altın Fiyatı Verir",
            availability=StaffMember.Availability.BUSY,
        )
        StaffMember.objects.create(
            organization=org,
            name="Zeynep Arslan",
            title="Mağaza Müdürü",
            phone="+90 532 700 3344",
            specialty="Şikayet & iade",
            availability=StaffMember.Availability.AVAILABLE,
        )
        StaffMember.objects.create(
            organization=org,
            name="Burak Çelik",
            title="Vitrin Uzmanı",
            phone="+90 532 700 5566",
            specialty="Yüzük deneme randevusu",
            availability=StaffMember.Availability.AVAILABLE,
        )

        for i in range(16):
            ServiceRequest.objects.create(
                organization=org,
                title="Geri Arama Talebi",
                description=(
                    "Müşteri Yaşar ücretsiz bakım kampanyası hakkında bilgi istedi."
                    if i % 3 == 0
                    else "Müşteri fiyat bilgisi için geri arama talep etti."
                ),
                category=ServiceRequest.Category.CALLBACK,
                priority=ServiceRequest.Priority.MEDIUM,
                status=ServiceRequest.Status.NEW,
                phone=f"+90 555 200 {1000 + i}",
                assignee=staff1 if i % 5 == 0 else None,
                created_at=now - timedelta(days=i % 7, hours=i),
            )

        campaign = Campaign.objects.create(
            organization=org,
            agent=agent,
            name="Anneler Günü Kampanyası",
            line_label="Verimor-v4 (+903129630120)",
            message=(
                "Merhaba, Vizyon Kuyumculuk'tan arıyoruz. Anneler Günü'ne özel seçili "
                "ürünlerde yüzde 10 indirim fırsatımız var. Mağazamıza bekleriz."
            ),
            status=Campaign.Status.DRAFT,
        )
        contacts = [
            ("Ahmet Yılmaz", "+90 532 111 0001", "CRM"),
            ("Fatma Kaya", "+90 532 111 0002", "CRM"),
            ("Hasan Demir", "+90 532 111 0003", "Çağrı Kaydı"),
            ("Ayşe Polat", "+90 532 111 0004", "CRM"),
            ("Mehmet Can", "+90 532 111 0005", "Çağrı Kaydı"),
            ("Elif Su", "+90 532 111 0006", "CRM"),
            ("Deniz Acar", "+90 532 111 0007", "CRM"),
            ("Cem Yurt", "+90 532 111 0008", "CRM"),
            ("Seda Nur", "+90 532 111 0009", "Çağrı Kaydı"),
            ("Kerem Ak", "+90 532 111 0010", "CRM"),
            ("Nazlı Er", "+90 532 111 0011", "CRM"),
        ]
        CampaignContact.objects.bulk_create(
            [
                CampaignContact(
                    campaign=campaign,
                    name=name,
                    phone=phone,
                    source=source,
                    call_status=CampaignContact.CallStatus.WAITING,
                )
                for name, phone, source in contacts
            ]
        )

        WhatsAppMessage.objects.bulk_create(
            [
                WhatsAppMessage(
                    organization=org,
                    customer_number="+90 555 321 7788",
                    preview="Gram altın satış fiyatını öğrenmek istiyorum.",
                    occurred_at=now - timedelta(hours=6),
                ),
                WhatsAppMessage(
                    organization=org,
                    customer_number="+90 555 321 9900",
                    preview="Yüzük ölçü randevusu alabilir miyim?",
                    occurred_at=now - timedelta(days=1),
                ),
            ]
        )

        Competitor.objects.bulk_create(
            [
                Competitor(
                    organization=org,
                    name="Vizyon Kuyumculuk",
                    address="Ulus, Ankara",
                    rating=Decimal("4.6"),
                    review_count=214,
                    notes="Fiyat odaklı yorumlar yüksek.",
                ),
                Competitor(
                    organization=org,
                    name="Altın Park",
                    address="Kızılay, Ankara",
                    rating=Decimal("4.2"),
                    review_count=98,
                    notes="Hızlı servis vurgusu.",
                ),
            ]
        )

        AnalysisReport.objects.create(
            organization=org,
            title="Haftalık çağrı özeti",
            summary="Fiyat soruları ve geri arama talepleri öne çıkıyor.",
            recommendations="Bilgi Bankası'ndaki fiyat maddesini canlı tutun ve outbound kampanyayı başlatın.",
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Mecidiye demo ready. Login: demo@artificagent.com / DemoPass123!"
            )
        )
