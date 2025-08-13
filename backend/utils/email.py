import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
import os
from jinja2 import Environment, FileSystemLoader
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "localhost")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME", "")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@jobplatform.com")
        self.from_name = os.getenv("FROM_NAME", "Job Platform")
        
        # Setup Jinja2 environment for email templates
        template_path = os.path.join(os.path.dirname(__file__), "..", "email_templates")
        if os.path.exists(template_path):
            self.template_env = Environment(loader=FileSystemLoader(template_path))
        else:
            self.template_env = None
            logger.warning(f"Email template directory not found: {template_path}")

    def send_email(
        self,
        to_emails: List[str],
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send an email to recipients"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = ', '.join(to_emails)

            # Add text part if provided
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)

            # Add HTML part
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)

            # Send email
            if self.smtp_username and self.smtp_password:
                with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_username, self.smtp_password)
                    server.send_message(msg)
            else:
                # For development - just log the email
                logger.info(f"[EMAIL] To: {', '.join(to_emails)}")
                logger.info(f"[EMAIL] Subject: {subject}")
                logger.info(f"[EMAIL] Content: {html_content}")
                
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False

    def render_template(self, template_name: str, **kwargs) -> str:
        """Render an email template with context variables"""
        if not self.template_env:
            # Fallback to simple string formatting if no template engine
            return f"<html><body><h1>{template_name}</h1><pre>{kwargs}</pre></body></html>"
        
        try:
            template = self.template_env.get_template(template_name)
            return template.render(**kwargs)
        except Exception as e:
            logger.error(f"Failed to render template {template_name}: {str(e)}")
            return f"<html><body><p>Error rendering email template</p></body></html>"

# Email notification functions
def send_welcome_email(user_email: str, user_name: str, user_type: str):
    """Send welcome email to new user"""
    email_service = EmailService()
    
    subject = "Welcome to Job Platform!"
    html_content = email_service.render_template("welcome.html", 
        user_name=user_name, 
        user_type=user_type
    )
    
    return email_service.send_email([user_email], subject, html_content)

def send_job_application_notification(employer_email: str, job_title: str, candidate_name: str):
    """Send notification to employer about new job application"""
    email_service = EmailService()
    
    subject = f"New Application for {job_title}"
    html_content = email_service.render_template("job_application.html",
        job_title=job_title,
        candidate_name=candidate_name
    )
    
    return email_service.send_email([employer_email], subject, html_content)

def send_application_status_update(candidate_email: str, job_title: str, company_name: str, new_status: str):
    """Send notification to candidate about application status change"""
    email_service = EmailService()
    
    subject = f"Application Update: {job_title} at {company_name}"
    html_content = email_service.render_template("application_status.html",
        job_title=job_title,
        company_name=company_name,
        status=new_status
    )
    
    return email_service.send_email([candidate_email], subject, html_content)

def send_new_message_notification(recipient_email: str, sender_name: str, subject: str):
    """Send notification about new message"""
    email_service = EmailService()
    
    email_subject = f"New Message from {sender_name}"
    html_content = email_service.render_template("new_message.html",
        sender_name=sender_name,
        message_subject=subject
    )
    
    return email_service.send_email([recipient_email], email_subject, html_content)

def send_job_alert(candidate_email: str, candidate_name: str, matching_jobs: List[dict]):
    """Send job alert email to candidate with matching jobs"""
    email_service = EmailService()
    
    subject = f"New Job Opportunities for You"
    html_content = email_service.render_template("job_alert.html",
        candidate_name=candidate_name,
        jobs=matching_jobs
    )
    
    return email_service.send_email([candidate_email], subject, html_content)