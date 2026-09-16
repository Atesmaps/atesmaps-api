output "ecr_repository_url" {
  description = "The URL of the ECR repository this repository's CI pushes images to."
  value       = module.ecr.repository_url
}

output "gha_role_arn" {
  description = "The IAM role ARN assumed by this repository's GitHub Actions via OIDC."
  value       = aws_iam_role.gha.arn
}
