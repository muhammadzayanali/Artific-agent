from django.urls import path

from conversations.views import ConversationDetailView

from .views import (
    AnalysisListCreateView,
    CallHistoryStatsView,
    CampaignListView,
    CampaignStartView,
    CompetitorListCreateView,
    CompetitorScanView,
    ConversationSearchView,
    DashboardView,
    KnowledgeDetailView,
    KnowledgeListCreateView,
    LiveCallsView,
    MinutePackageRequestView,
    ProfileView,
    RequestDetailView,
    RequestListCreateView,
    StaffDetailView,
    StaffListCreateView,
    WhatsAppListView,
)

urlpatterns = [
    path("dashboard/", DashboardView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("profile/minutes/", MinutePackageRequestView.as_view()),
    path("knowledge/", KnowledgeListCreateView.as_view()),
    path("knowledge/<int:pk>/", KnowledgeDetailView.as_view()),
    path("staff/", StaffListCreateView.as_view()),
    path("staff/<int:pk>/", StaffDetailView.as_view()),
    path("requests/", RequestListCreateView.as_view()),
    path("requests/<int:pk>/", RequestDetailView.as_view()),
    path("campaigns/", CampaignListView.as_view()),
    path("campaigns/<int:pk>/start/", CampaignStartView.as_view()),
    path("whatsapp/", WhatsAppListView.as_view()),
    path("competitors/", CompetitorListCreateView.as_view()),
    path("competitors/scan/", CompetitorScanView.as_view()),
    path("analysis/", AnalysisListCreateView.as_view()),
    path("calls/live/", LiveCallsView.as_view()),
    path("calls/history/", ConversationSearchView.as_view()),
    path("calls/stats/", CallHistoryStatsView.as_view()),
    path("calls/<int:pk>/", ConversationDetailView.as_view()),
]
