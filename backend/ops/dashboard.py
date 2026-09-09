"""Period-scoped dashboard aggregations (no per-tile client scopes)."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from typing import Any

from django.conf import settings
from django.db.models import Count, Q, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone

from agents.models import Agent
from conversations.models import Conversation
from ops.models import Campaign, KnowledgeEntry, OrganizationProfile, ServiceRequest, StaffMember


POTENTIAL_Q = (
    Q(outcome="appointment")
    | Q(outcome="follow_up")
    | Q(detected_need__icontains="fiyat")
)
TRANSFER_Q = Q(outcome="handoff")


def _day_bounds(day):
    start = timezone.make_aware(datetime.combine(day, time.min))
    end = timezone.make_aware(datetime.combine(day, time.max))
    return start, end


def resolve_period(params) -> tuple[str, datetime, datetime, datetime, datetime]:
    """
    Returns period_key, current_start, current_end, previous_start, previous_end.
    All datetimes are timezone-aware.
    """
    now = timezone.now()
    key = (params.get("period") or "today").strip().lower()
    if key not in {"today", "7d", "30d", "custom"}:
        key = "today"

    if key == "custom":
        raw_from = params.get("from")
        raw_to = params.get("to")
        try:
            start_day = datetime.strptime(raw_from, "%Y-%m-%d").date()
            end_day = datetime.strptime(raw_to, "%Y-%m-%d").date()
        except (TypeError, ValueError):
            key = "7d"
        else:
            if end_day < start_day:
                start_day, end_day = end_day, start_day
            cur_start, _ = _day_bounds(start_day)
            _, cur_end = _day_bounds(end_day)
            length = (end_day - start_day).days + 1
            prev_end_day = start_day - timedelta(days=1)
            prev_start_day = prev_end_day - timedelta(days=length - 1)
            prev_start, _ = _day_bounds(prev_start_day)
            _, prev_end = _day_bounds(prev_end_day)
            return key, cur_start, min(cur_end, now), prev_start, prev_end

    today = timezone.localdate()
    if key == "today":
        cur_start, cur_end = _day_bounds(today)
        prev_day = today - timedelta(days=1)
        prev_start, prev_end = _day_bounds(prev_day)
        return key, cur_start, min(cur_end, now), prev_start, prev_end

    days = 7 if key == "7d" else 30
    end_day = today
    start_day = today - timedelta(days=days - 1)
    cur_start, _ = _day_bounds(start_day)
    _, cur_end = _day_bounds(end_day)
    prev_end_day = start_day - timedelta(days=1)
    prev_start_day = prev_end_day - timedelta(days=days - 1)
    prev_start, _ = _day_bounds(prev_start_day)
    _, prev_end = _day_bounds(prev_end_day)
    return key, cur_start, min(cur_end, now), prev_start, prev_end


def _pct(part: int, whole: int) -> float | None:
    if whole <= 0:
        return None
    return round(100.0 * part / whole, 1)


def _trend(current: float | int | None, previous: float | int | None) -> dict[str, Any]:
    if current is None or previous is None:
        return {"direction": "flat", "delta_pct": None, "label": "Karşılaştırma yok"}
    if previous == 0:
        if current == 0:
            return {"direction": "flat", "delta_pct": 0.0, "label": "Değişim yok"}
        return {"direction": "up", "delta_pct": None, "label": "Önceki dönem 0"}
    delta = ((float(current) - float(previous)) / float(previous)) * 100.0
    direction = "up" if delta > 2 else "down" if delta < -2 else "flat"
    sign = "+" if delta > 0 else ""
    return {
        "direction": direction,
        "delta_pct": round(delta, 1),
        "label": f"{sign}{round(delta, 1)}% önceki döneme göre",
    }


def _call_bucket(qs):
    agg = qs.aggregate(
        total=Count("id"),
        potential=Count("id", filter=POTENTIAL_Q),
        transfer=Count("id", filter=TRANSFER_Q),
        duration=Sum("duration_seconds"),
    )
    total = agg["total"] or 0
    potential = agg["potential"] or 0
    transfer = agg["transfer"] or 0
    duration = agg["duration"] or 0
    return {
        "calls": total,
        "potential": potential,
        "transfer": transfer,
        "potential_rate": _pct(potential, total),
        "transfer_rate": _pct(transfer, total),
        "minutes_consumed": round(duration / 60.0, 1),
    }


def _series(organization, start, end):
    rows = (
        Conversation.objects.filter(
            organization=organization,
            started_at__gte=start,
            started_at__lte=end,
        )
        .annotate(day=TruncDate("started_at"))
        .values("day")
        .annotate(
            calls=Count("id"),
            potential=Count("id", filter=POTENTIAL_Q),
            transfer=Count("id", filter=TRANSFER_Q),
        )
        .order_by("day")
    )
    by_day = {r["day"]: r for r in rows}
    out = []
    cursor = timezone.localdate(start)
    last = timezone.localdate(end)
    while cursor <= last:
        row = by_day.get(cursor)
        out.append(
            {
                "date": cursor.isoformat(),
                "day": cursor.strftime("%a"),
                "calls": (row["calls"] if row else 0),
                "potential": (row["potential"] if row else 0),
                "transfer": (row["transfer"] if row else 0),
            }
        )
        cursor += timedelta(days=1)
    return out


def build_dashboard(organization, params) -> dict[str, Any]:
    period_key, cur_start, cur_end, prev_start, prev_end = resolve_period(params)
    profile = OrganizationProfile.objects.filter(organization=organization).first()
    remaining = float(profile.remaining_minutes) if profile else 0.0

    cur_calls = Conversation.objects.filter(
        organization=organization, started_at__gte=cur_start, started_at__lte=cur_end
    )
    prev_calls = Conversation.objects.filter(
        organization=organization, started_at__gte=prev_start, started_at__lte=prev_end
    )
    cur = _call_bucket(cur_calls)
    prev = _call_bucket(prev_calls)

    period_days = max((timezone.localdate(cur_end) - timezone.localdate(cur_start)).days + 1, 1)
    burn_per_day = cur["minutes_consumed"] / period_days if period_days else 0.0
    if burn_per_day > 0:
        days_left = round(remaining / burn_per_day, 1)
        burn_line = f"Bu tempoda bakiye ~{days_left} günde biter"
    else:
        days_left = None
        burn_line = "Bu dönemde ölçülebilir dakika tüketimi yok"

    # Requests in period (created_at)
    req_qs = ServiceRequest.objects.filter(
        organization=organization,
        created_at__gte=cur_start,
        created_at__lte=cur_end,
    )
    open_qs = ServiceRequest.objects.filter(
        organization=organization,
        status__in=["new", "in_progress"],
    )
    actionable = open_qs.exclude(phone="").exclude(phone__isnull=True)
    needs_review = open_qs.filter(Q(phone="") | Q(phone__isnull=True))
    oldest = open_qs.order_by("created_at").first()
    oldest_payload = None
    if oldest:
        age_hours = round((timezone.now() - oldest.created_at).total_seconds() / 3600.0, 1)
        oldest_payload = {
            "id": oldest.id,
            "title": oldest.title,
            "created_at": oldest.created_at.isoformat(),
            "age_hours": age_hours,
            "phone": oldest.phone or "",
        }

    leads_generated = req_qs.filter(status__in=["new", "in_progress", "completed"]).count()
    prev_leads = ServiceRequest.objects.filter(
        organization=organization,
        created_at__gte=prev_start,
        created_at__lte=prev_end,
        status__in=["new", "in_progress", "completed"],
    ).count()

    knowledge_live = KnowledgeEntry.objects.filter(
        organization=organization, status="live"
    ).count()
    knowledge_pending = KnowledgeEntry.objects.filter(
        organization=organization, status="pending"
    ).count()
    agent = Agent.objects.filter(organization=organization).order_by("id").first()
    sync_at = agent.last_synced_at if agent else None
    sync_ok = bool(agent.last_sync_ok) if agent else True

    # Campaigns: only if any running or done ever / in period activity
    campaigns = (
        Campaign.objects.filter(organization=organization)
        .annotate(
            total_targets=Count("contacts"),
            called_count=Count("contacts", filter=~Q(contacts__call_status="waiting")),
            success_count=Count("contacts", filter=Q(contacts__call_status="success")),
        )
        .filter(Q(status="running") | Q(status="done") | Q(status="paused"))
        .order_by("-created_at")
    )
    campaign_payload = None
    active_or_recent = campaigns.first()
    if active_or_recent and (active_or_recent.total_targets or 0) > 0:
        targets = active_or_recent.total_targets or 0
        called = active_or_recent.called_count or 0
        success = active_or_recent.success_count or 0
        campaign_payload = {
            "id": active_or_recent.id,
            "name": active_or_recent.name,
            "status": active_or_recent.status,
            "targets": targets,
            "connect_rate": _pct(called, targets),
            "conversion_rate": _pct(success, targets),
            "called": called,
            "success": success,
        }

    attention = _build_attention(
        organization=organization,
        profile=profile,
        remaining=remaining,
        cur=cur,
        prev=prev,
        oldest=oldest,
        agent=agent,
        knowledge_pending=knowledge_pending,
    )

    period_label = {
        "today": "Bugün",
        "7d": "Son 7 gün",
        "30d": "Son 30 gün",
        "custom": "Özel aralık",
    }.get(period_key, period_key)

    return {
        "period": {
            "key": period_key,
            "label": period_label,
            "start": cur_start.isoformat(),
            "end": cur_end.isoformat(),
            "previous_start": prev_start.isoformat(),
            "previous_end": prev_end.isoformat(),
        },
        "attention": attention,
        "metrics": {
            "calls_handled": {
                "value": cur["calls"],
                "trend": _trend(cur["calls"], prev["calls"]),
                "interpretation": f"{period_label} içinde karşılanan çağrı",
            },
            "potential_rate": {
                "value": cur["potential_rate"],
                "trend": _trend(cur["potential_rate"], prev["potential_rate"]),
                "interpretation": "Randevu / takip / fiyat niyeti oranı",
            },
            "transfer_rate": {
                "value": cur["transfer_rate"],
                "trend": _trend(cur["transfer_rate"], prev["transfer_rate"]),
                "interpretation": "Personele aktarım oranı",
            },
            "minutes": {
                "consumed": cur["minutes_consumed"],
                "remaining": remaining,
                "burn_per_day": round(burn_per_day, 1),
                "days_remaining_at_pace": days_left,
                "burn_line": burn_line,
                "trend": _trend(cur["minutes_consumed"], prev["minutes_consumed"]),
            },
            "leads": {
                "value": leads_generated,
                "trend": _trend(leads_generated, prev_leads),
                "interpretation": "Bu dönemde oluşan talepler",
            },
        },
        "queue": {
            "actionable_now": actionable.count(),
            "needs_review": needs_review.count(),
            "oldest": oldest_payload,
        },
        "knowledge": {
            "live_entries": knowledge_live,
            "pending_entries": knowledge_pending,
            "last_synced_at": sync_at.isoformat() if sync_at else None,
            "last_sync_ok": sync_ok,
            "agent_name": agent.name if agent else None,
            "agent_status": agent.status if agent else None,
        },
        "chart": {
            "series": _series(organization, cur_start, cur_end),
            "overlay": ["potential", "transfer"],
        },
        "campaign": campaign_payload,
        "assistant": {
            "ai_line": profile.ai_line if profile else "",
            "language": profile.language if profile else "Türkçe",
            "active": bool(profile and profile.is_active),
        },
    }


def _build_attention(*, organization, profile, remaining, cur, prev, oldest, agent, knowledge_pending):
    cfg = getattr(settings, "DASHBOARD_ATTENTION", {})
    low_minutes = float(cfg.get("low_minutes", 30))
    drop_pct = float(cfg.get("call_drop_pct", 40))
    queue_age_h = float(cfg.get("queue_age_hours", 24))
    sync_stale_h = float(cfg.get("sync_stale_hours", 72))

    items = []

    if remaining <= low_minutes:
        items.append(
            {
                "id": "low_minutes",
                "severity": "amber" if remaining > 0 else "red",
                "title": "Dakika bakiyesi düşük",
                "body": f"Kalan {remaining:.1f} dk — paket talebi düşünün.",
                "href": "/panel/settings",
            }
        )

    available = StaffMember.objects.filter(
        organization=organization, availability="available"
    ).count()
    if available == 0 and StaffMember.objects.filter(organization=organization).exists():
        items.append(
            {
                "id": "staff_unavailable",
                "severity": "amber",
                "title": "Müsait personel yok",
                "body": "Transfer gerektiğinde kimse çevrimiçi görünmüyor.",
                "href": "/panel/staff",
            }
        )

    if prev["calls"] >= 3 and cur["calls"] < prev["calls"]:
        drop = ((prev["calls"] - cur["calls"]) / prev["calls"]) * 100
        if drop >= drop_pct:
            items.append(
                {
                    "id": "call_drop",
                    "severity": "amber",
                    "title": "Çağrı hacminde düşüş",
                    "body": f"Önceki döneme göre %{round(drop)} daha az çağrı.",
                    "href": "/panel/call-history",
                }
            )

    if oldest:
        age_h = (timezone.now() - oldest.created_at).total_seconds() / 3600.0
        if age_h >= queue_age_h:
            items.append(
                {
                    "id": "stale_request",
                    "severity": "red",
                    "title": "Eski talep bekliyor",
                    "body": f"“{oldest.title}” {round(age_h)} saattir çözülmedi.",
                    "href": "/panel/requests",
                }
            )

    if agent and agent.last_sync_ok is False:
        items.append(
            {
                "id": "sync_failed",
                "severity": "red",
                "title": "Ajan senkronu başarısız",
                "body": "Bilgi bankası / ajan son senkron denemesinde hata verdi.",
                "href": "/panel/agents",
            }
        )
    elif agent and agent.last_synced_at:
        age = (timezone.now() - agent.last_synced_at).total_seconds() / 3600.0
        if age >= sync_stale_h:
            items.append(
                {
                    "id": "sync_stale",
                    "severity": "amber",
                    "title": "Senkron güncel değil",
                    "body": f"Son başarılı senkron ~{round(age / 24, 1)} gün önce.",
                    "href": "/panel/agents",
                }
            )
    elif knowledge_pending > 0:
        items.append(
            {
                "id": "kb_pending",
                "severity": "amber",
                "title": "Onay bekleyen bilgi",
                "body": f"{knowledge_pending} bilgi kaydı yayında değil.",
                "href": "/panel/knowledge",
            }
        )

    if profile and not profile.is_active:
        items.append(
            {
                "id": "assistant_paused",
                "severity": "red",
                "title": "Asistan pasif",
                "body": "Hat şu an kapalı görünüyor — ayarlardan kontrol edin.",
                "href": "/panel/settings",
            }
        )

    return items
