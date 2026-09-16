locals {
  name        = "${var.application}-${var.environment}"
  name_suffix = "api"
  ssm_prefix  = "/${replace(local.name, "-", "/")}/${local.name_suffix}"
}
