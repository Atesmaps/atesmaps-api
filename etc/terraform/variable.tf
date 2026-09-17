variable "application" {
  default     = "atesmaps"
  description = "The application name."
  type        = string
}

variable "aws_profile" {
  description = "The AWS profile name to use."
  type        = string
}

variable "environment" {
  description = "The environment to use. Valid values are: prod."
  type        = string

  validation {
    condition     = contains(["prod"], var.environment)
    error_message = "Environment not valid. Valid values are: prod"
  }
}

variable "github_org" {
  default     = "Atesmaps"
  description = "The GitHub organization name to configure OpenID Connect identity provider."
  type        = string
}

variable "github_repository" {
  default     = "atesmaps-api"
  description = "The name of this GitHub repository to configure OpenID Connect identity provider."
  type        = string
}

variable "region" {
  default     = "eu-west-1"
  description = "The AWS region name."
  type        = string
}
