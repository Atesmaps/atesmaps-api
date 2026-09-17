# ── Secrets (SecureString) — values managed outside Terraform ─────────────────
# OpenTofu creates the parameter as a placeholder; the real value is set manually
# in SSM afterward (e.g. `aws ssm put-parameter --overwrite ...`) and never
# touched by subsequent applies.

resource "aws_ssm_parameter" "access_token_secret" {
  name        = "${local.ssm_prefix}/ACCESS_TOKEN_SECRET"
  description = "JWT access token secret for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "refresh_token_secret" {
  name        = "${local.ssm_prefix}/REFRESH_TOKEN_SECRET"
  description = "JWT refresh token secret for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "database_uri" {
  name        = "${local.ssm_prefix}/DATABASE_URI"
  description = "MongoDB connection URI for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_android_client_id" {
  name        = "${local.ssm_prefix}/GOOGLE_ANDROID_CLIENT_ID"
  description = "Google Android OAuth client ID for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_ios_client_id" {
  name        = "${local.ssm_prefix}/GOOGLE_IOS_CLIENT_ID"
  description = "Google iOS OAuth client ID for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_web_client_id" {
  name        = "${local.ssm_prefix}/GOOGLE_WEB_CLIENT_ID"
  description = "Google Web OAuth client ID for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "mailer_pass" {
  name        = "${local.ssm_prefix}/MAILER_PASS"
  description = "Mailer SMTP password for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "lauegi_api_key" {
  name        = "${local.ssm_prefix}/LAUEGI_API_KEY"
  description = "Lauegi API key for ${local.name} API."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

# Base64-encoded Firebase service account JSON. Typically ~3-3.5KB, which fits
# a Standard-tier SSM parameter (4KB limit) — if it ever doesn't, add
# `tier = "Advanced"` here (8KB limit) rather than switching parameter type.
resource "aws_ssm_parameter" "firebase_service_account_base64" {
  name        = "${local.ssm_prefix}/FIREBASE_SERVICE_ACCOUNT_BASE64"
  description = "Base64-encoded Firebase service account JSON for ${local.name} API push notifications."
  type        = "SecureString"
  value       = "pending"

  lifecycle {
    ignore_changes = [value]
  }
}

# ── Non-secrets (String) — values managed by Terraform ───────────────────────

resource "aws_ssm_parameter" "mailer_smtp" {
  name        = "${local.ssm_prefix}/MAILER_SMTP"
  description = "Mailer SMTP host for ${local.name} API."
  type        = "String"
  value       = "smtp.dondominio.com"
}

resource "aws_ssm_parameter" "mailer_user" {
  name        = "${local.ssm_prefix}/MAILER_USER"
  description = "Mailer sender address for ${local.name} API."
  type        = "String"
  value       = "info@atesmaps.org"
}
