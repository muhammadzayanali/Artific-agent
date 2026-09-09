from datetime import timedelta

from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from conversations.models import Conversation
from conversations.serializers import ConversationListSerializer, ConversationDetailSerializer

from .dashboard import build_dashboard
from .models import (
    AnalysisReport,
    Campaign,
    Competitor,
    KnowledgeEntry,
    OrganizationProfile,
    ServiceRequest,
    StaffMember,
    WhatsAppMessage,
)
from .serializers import (
    AnalysisReportSerializer,
    CampaignSerializer,
    CompetitorSerializer,
    KnowledgeEntrySerializer,
    OrganizationProfileSerializer,
    ServiceRequestSerializer,
    StaffMemberSerializer,
    WhatsAppMessageSerializer,
)


def org_of(request):
    return request.user.organization


class DashboardView(APIView):
    def get(self, request):
        organization = org_of(request)
        if organization is None:
            return Response({"detail": "No organization."}, status=400)
        payload = build_dashboard(organization, request.query_params)
        return Response(payload)


class ProfileView(RetrieveUpdateAPIView):
    serializer_class = OrganizationProfileSerializer

    def get_object(self):
        organization = org_of(self.request)
        profile, _ = OrganizationProfile.objects.get_or_create(organization=organization)
        return profile


class KnowledgeListCreateView(ListCreateAPIView):
    serializer_class = KnowledgeEntrySerializer

    def get_queryset(self):
        qs = KnowledgeEntry.objects.filter(organization=org_of(self.request))
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs

    def perform_create(self, serializer):
        serializer.save(organization=org_of(self.request))


class KnowledgeDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = KnowledgeEntrySerializer

    def get_queryset(self):
        return KnowledgeEntry.objects.filter(organization=org_of(self.request))


class StaffListCreateView(ListCreateAPIView):
    serializer_class = StaffMemberSerializer

    def get_queryset(self):
        return StaffMember.objects.filter(organization=org_of(self.request))

    def perform_create(self, serializer):
        serializer.save(organization=org_of(self.request))


class StaffDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = StaffMemberSerializer

    def get_queryset(self):
        return StaffMember.objects.filter(organization=org_of(self.request))


class RequestListCreateView(ListCreateAPIView):
    serializer_class = ServiceRequestSerializer

    def get_queryset(self):
        qs = ServiceRequest.objects.filter(organization=org_of(self.request)).select_related(
            "assignee"
        )
        category = self.request.query_params.get("category")
        status_filter = self.request.query_params.get("status")
        if category:
            qs = qs.filter(category=category)
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def perform_create(self, serializer):
        serializer.save(organization=org_of(self.request))


class RequestDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceRequestSerializer

    def get_queryset(self):
        return ServiceRequest.objects.filter(organization=org_of(self.request)).select_related(
            "assignee"
        )


class CampaignListView(ListAPIView):
    serializer_class = CampaignSerializer

    def get_queryset(self):
        return (
            Campaign.objects.filter(organization=org_of(self.request))
            .select_related("agent")
            .prefetch_related("contacts")
            .annotate(
                total_targets=Count("contacts"),
                called_count=Count("contacts", filter=~Q(contacts__call_status="waiting")),
                success_count=Count("contacts", filter=Q(contacts__call_status="success")),
                failed_count=Count("contacts", filter=Q(contacts__call_status="failed")),
            )
        )


class CampaignStartView(APIView):
    def post(self, request, pk):
        campaign = Campaign.objects.filter(
            organization=org_of(request), pk=pk
        ).first()
        if not campaign:
            return Response({"detail": "Not found."}, status=404)
        campaign.status = Campaign.Status.RUNNING
        campaign.save(update_fields=["status"])
        return Response(CampaignSerializer(self._annotated(campaign)).data)

    def _annotated(self, campaign):
        return (
            Campaign.objects.filter(pk=campaign.pk)
            .annotate(
                total_targets=Count("contacts"),
                called_count=Count("contacts", filter=~Q(contacts__call_status="waiting")),
                success_count=Count("contacts", filter=Q(contacts__call_status="success")),
                failed_count=Count("contacts", filter=Q(contacts__call_status="failed")),
            )
            .first()
        )


class WhatsAppListView(ListAPIView):
    serializer_class = WhatsAppMessageSerializer

    def get_queryset(self):
        qs = WhatsAppMessage.objects.filter(organization=org_of(self.request))
        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(Q(customer_number__icontains=q) | Q(preview__icontains=q))
        return qs


class CompetitorListCreateView(ListCreateAPIView):
    serializer_class = CompetitorSerializer

    def get_queryset(self):
        return Competitor.objects.filter(organization=org_of(self.request))

    def perform_create(self, serializer):
        serializer.save(organization=org_of(self.request))


class CompetitorScanView(APIView):
    """Demo scan: adds sample nearby competitors if missing."""

    def post(self, request):
        organization = org_of(request)
        samples = [
            {
                "name": "Vizyon Kuyumculuk",
                "address": "Kızılay, Ankara",
                "rating": 4.6,
                "review_count": 218,
                "notes": "Güçlü online yorumlar; fiyat rekabeti yüksek.",
            },
            {
                "name": "Altın Sarayı",
                "address": "Çankaya, Ankara",
                "rating": 4.3,
                "review_count": 142,
                "notes": "Randevu odaklı; akşam saatleri yoğun.",
            },
            {
                "name": "Midas Gold",
                "address": "Ümitköy, Ankara",
                "rating": 4.1,
                "review_count": 89,
                "notes": "Kampanya duyuruları agresif; WhatsApp yanıtları hızlı.",
            },
        ]
        created = []
        for sample in samples:
            obj, was_created = Competitor.objects.get_or_create(
                organization=organization,
                name=sample["name"],
                defaults=sample,
            )
            if was_created:
                created.append(obj)
        return Response(
            {
                "ok": True,
                "added": CompetitorSerializer(created, many=True).data,
                "total": Competitor.objects.filter(organization=organization).count(),
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class MinutePackageRequestView(APIView):
    """Demo minute top-up request — adds minutes for the org profile."""

    def post(self, request):
        organization = org_of(request)
        profile, _ = OrganizationProfile.objects.get_or_create(organization=organization)
        from decimal import Decimal

        amount = Decimal(str(request.data.get("minutes", 100)))
        profile.remaining_minutes = Decimal(profile.remaining_minutes) + amount
        profile.save(update_fields=["remaining_minutes"])
        return Response(
            {
                "ok": True,
                "added": float(amount),
                "remaining_minutes": float(profile.remaining_minutes),
                "detail": f"{amount} dakika bakiyenize eklendi (demo).",
            }
        )


class AnalysisListCreateView(ListCreateAPIView):
    serializer_class = AnalysisReportSerializer

    def get_queryset(self):
        return AnalysisReport.objects.filter(organization=org_of(self.request))

    def perform_create(self, serializer):
        serializer.save(organization=org_of(self.request))

    def create(self, request, *args, **kwargs):
        organization = org_of(request)
        calls = Conversation.objects.filter(organization=organization).count()
        transfers = Conversation.objects.filter(
            organization=organization, outcome="handoff"
        ).count()
        pending = ServiceRequest.objects.filter(
            organization=organization, status="new"
        ).count()
        report = AnalysisReport.objects.create(
            organization=organization,
            title=f"Canlı analiz · {timezone.localdate().isoformat()}",
            summary=(
                f"Son dönemde {calls} görüşme kaydı incelendi. "
                f"{transfers} aktarım ve {pending} açık talep tespit edildi."
            ),
            recommendations=(
                "1) Altın fiyatı sorularını Bilgi Bankası'nda önceliklendirin.\n"
                "2) Yoğun saatlerde personel müsaitliğini artırın.\n"
                "3) Anneler Günü kampanyasını outbound ile yeniden çalıştırın."
            ),
        )
        return Response(
            AnalysisReportSerializer(report).data, status=status.HTTP_201_CREATED
        )


class CallHistoryStatsView(APIView):
    def get(self, request):
        organization = org_of(request)
        calls = Conversation.objects.filter(organization=organization)
        duration = calls.aggregate(total=Sum("duration_seconds"))["total"] or 0
        minutes, seconds = divmod(duration, 60)
        return Response(
            {
                "total": calls.count(),
                "potential": calls.filter(
                    Q(outcome="appointment") | Q(outcome="follow_up")
                ).count(),
                "transfers": calls.filter(outcome="handoff").count(),
                "total_duration": f"{minutes:02d}:{seconds:02d}",
            }
        )


class LiveCallsView(ListAPIView):
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        return Conversation.objects.filter(
            organization=org_of(self.request), status="live"
        ).select_related("agent")


class ConversationSearchView(ListAPIView):
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        qs = Conversation.objects.filter(organization=org_of(self.request)).select_related(
            "agent"
        )
        status_filter = self.request.query_params.get("status")
        q = self.request.query_params.get("q")
        tag = self.request.query_params.get("tag")
        if status_filter:
            qs = qs.filter(status=status_filter)
        if tag == "potential":
            qs = qs.filter(Q(outcome="appointment") | Q(outcome="follow_up"))
        if tag == "transfer":
            qs = qs.filter(outcome="handoff")
        if q:
            qs = qs.filter(
                Q(summary__icontains=q)
                | Q(caller_number__icontains=q)
                | Q(caller_name__icontains=q)
            )
        return qs
