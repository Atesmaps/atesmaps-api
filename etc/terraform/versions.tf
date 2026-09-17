terraform {
  required_version = ">= 1.10"

  backend "s3" {
    bucket               = "atesmaps-terraform"
    encrypt              = true
    key                  = "terraform.tfstate"
    profile              = "atesmaps"
    region               = "eu-west-1"
    use_lockfile         = true
    workspace_key_prefix = "atesmaps/api"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}
