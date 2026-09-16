provider "aws" {
  profile = var.aws_profile
  region  = var.region

  default_tags {
    tags = {
      Application = var.application
      Environment = var.environment
      Owner       = "atesmaps"
      Managed-By  = "terraform"
      Repository  = "${var.github_org}/${var.github_repository}"
    }
  }
}
