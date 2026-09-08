from rest_framework.generics import ListAPIView, RetrieveAPIView

from .models import Conversation
from .serializers import ConversationDetailSerializer, ConversationListSerializer


class ConversationListView(ListAPIView):
    serializer_class = ConversationListSerializer

    def get_queryset(self):
        organization = self.request.user.organization
        if organization is None:
            return Conversation.objects.none()
        qs = Conversation.objects.filter(organization=organization).select_related("agent")
        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)
        direction = self.request.query_params.get("direction")
        if direction:
            qs = qs.filter(direction=direction)
        return qs


class ConversationDetailView(RetrieveAPIView):
    serializer_class = ConversationDetailSerializer

    def get_queryset(self):
        organization = self.request.user.organization
        if organization is None:
            return Conversation.objects.none()
        return (
            Conversation.objects.filter(organization=organization)
            .select_related("agent")
            .prefetch_related("turns")
        )
