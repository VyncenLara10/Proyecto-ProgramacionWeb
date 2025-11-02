from datetime import datetime
from django.utils.timezone import now
from apps.common.tasks import send_email_task

def send_welcome_email(user, dashboard_url=None, support_email=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "now": now(),
    }

    subject = "TikalInvest | Tu cuenta fue aprobada"
    send_email_task.delay(user.email, subject, context)


def send_pending_authorization_email(user, support_email=None):

    prof = getattr(user, "profile", None)

    auth_method = "Local"
    if getattr(user, "auth0_id", "").startswith("google|"):
        auth_method = "Google"
    elif getattr(user, "auth0_id", "").startswith("facebook|"):
        auth_method = "Facebook"

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "authentic_method": auth_method,
        "submitted_at": now(),
    }

    subject = "TikalInvest | Estamos revisando tu cuenta"
    send_email_task.delay(user.email, subject, template, context)


def send_admin_new_user_email(admin_email, user, dashboard_url=None):
    prof = getattr(user, "profile", None)

    auth_method = "Local"
    if getattr(user, "auth0_id", "").startswith("google|"):
        auth_method = "Google"
    elif getattr(user, "auth0_id", "").startswith("facebook|"):
        auth_method = "Facebook"

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "authentic_method": auth_method,
        "created_at": getattr(user, "date_joined", now()),
    }

    subject = "TikalInvest | Nuevo usuario pendiente de aprobación"
    send_email_task.delay(admin_email, subject, context)


def send_trade_confirmation_email(user, trade, trade_detail_url=None, support_email=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "trade": trade,
    }

    subject = f"TikalInvest | Confirmación de {trade.get('type','').title()} – {trade.get('symbol','')}"
    send_email_task.delay(user.email, subject, context)


def send_wallet_movement_email(user, movement, wallet_url=None, support_email=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "movement": movement,
    }

    subject = f"TikalInvest | {movement.get('type','').title()} de wallet Q{movement.get('amount','')}"
    send_email_task.delay(user.email, subject, context)


def send_report_ready_email(user, period_from, period_to, support_email=None, attachment_path=None):
    prof = getattr(user, "profile", None)

    context = {
        "user": {
            "name": getattr(prof, "name", ""),
            "email": getattr(user, "email", ""),
        },
        "report": {
            "from": period_from,
            "to": period_to,
        },
        "generated_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
    }

    subject = "TikalInvest | Tu reporte está listo"
    send_email_task.delay(user.email, subject, context, attachment_path)
