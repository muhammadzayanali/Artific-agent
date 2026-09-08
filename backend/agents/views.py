from django.db.models import Count, Max, Q
from django.utils import timezone
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Agent
from .serializers import AgentSerializer


class AgentQueryMixin:
    serializer_class = AgentSerializer

    def get_queryset(self):
        organization = self.request.user.organization
        if organization is None:
            return Agent.objects.none()
        return (
            Agent.objects.filter(organization=organization)
            .prefetch_related("lines")
            .annotate(
                last_call_at=Max("conversations__started_at"),
                live_call_count=Count(
                    "conversations",
                    filter=Q(conversations__status="live"),
                ),
            )
        )


class AgentListView(AgentQueryMixin, ListAPIView):
    pass


class AgentDetailView(AgentQueryMixin, RetrieveUpdateAPIView):
    parser_classes = (JSONParser, MultiPartParser, FormParser)


class AgentVoiceUploadView(AgentQueryMixin, APIView):
    """Upload or replace the agent's voice sample (browser MediaRecorder / file)."""

    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, pk):
        agent = self.get_queryset().filter(pk=pk).first()
        if agent is None:
            return Response({"detail": "Ajan bulunamadı."}, status=404)
        file = request.FILES.get("voice_sample") or request.FILES.get("file")
        if not file:
            return Response({"detail": "Ses dosyası gerekli."}, status=400)
        if file.size > 8 * 1024 * 1024:
            return Response({"detail": "Dosya 8MB altında olmalı."}, status=400)
        if agent.voice_sample:
            agent.voice_sample.delete(save=False)
        agent.voice_sample = file
        agent.save(update_fields=["voice_sample", "updated_at"])
        return Response(AgentSerializer(agent, context={"request": request}).data)


class AgentSyncView(AgentQueryMixin, APIView):
    """Demo-friendly sync: mark agent as active and stamp sync time."""

    def post(self, request, pk):
        agent = self.get_queryset().filter(pk=pk).first()
        if agent is None:
            return Response({"detail": "Ajan bulunamadı."}, status=404)
        agent.status = Agent.Status.ACTIVE
        agent.save(update_fields=["status", "updated_at"])
        return Response(
            {
                "ok": True,
                "synced_at": timezone.now().isoformat(),
                "agent": AgentSerializer(agent, context={"request": request}).data,
            }
        )
