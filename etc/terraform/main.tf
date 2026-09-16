module "ecr" {
  source = "git::git@github.com:Atesmaps/platform.git//tf-modules/aws/ecr"

  application = var.application
  environment = var.environment
  name_suffix = local.name_suffix
}
