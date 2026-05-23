import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from .config import settings


def send_email(to_email: str, subject: str, body_html: str) -> None:
    """
    Send real email via SMTP.

    If SMTP isn't configured, this becomes a no-op with a console message.
    """
    if not settings.smtp_host:
        print(f"[MAILER] SMTP not configured. Would have sent to {to_email}: {subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.smtp_from
    msg["To"] = to_email
    msg.attach(MIMEText(body_html or "", "html"))

    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            server.starttls()
            if settings.smtp_user and settings.smtp_password:
                server.login(settings.smtp_user, settings.smtp_password)
            server.send_message(msg)
        print(f"[MAILER] Email sent to {to_email}: {subject}")
    except Exception as e:
        print(f"[MAILER] Failed to send email to {to_email}: {e}")
