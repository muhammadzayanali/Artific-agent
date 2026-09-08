from django.urls import path

from .views import AgentDetailView, AgentListView, AgentSyncView, AgentVoiceUploadView

urlpatterns = [
    path("agents/", AgentListView.as_view(), name="agent-list"),
    path("agents/<int:pk>/", AgentDetailView.as_view(), name="agent-detail"),
    path("agents/<int:pk>/voice/", AgentVoiceUploadView.as_view(), name="agent-voice"),
    path("agents/<int:pk>/sync/", AgentSyncView.as_view(), name="agent-sync"),
]
