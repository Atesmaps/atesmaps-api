# terraform

OpenTofu config for this repository's own AWS resources: an ECR repository to
push Docker images to, and a GitHub OIDC-assumable IAM role this repository's
CI uses to push images and deploy — no long-lived AWS credentials stored in
GitHub. Modeled on the `atesmaps` (web) repo's `etc/terraform` and on iFong's
`api` repo.

This config does **not** provision the EC2 host, VPC, or RDS database — those
live in the sibling `platform` repository (`aws/common` + `aws/atesmaps`).
This repo only owns the pieces specific to shipping *this* service's image
and secrets.

## Commands

```bash
cd etc/terraform
tofu init

tofu workspace new prod   # first time only
TF_WORKSPACE=prod tofu plan  -var-file=prod.tfvars
TF_WORKSPACE=prod tofu apply -var-file=prod.tfvars
```

Requires the AWS CLI configured with the `atesmaps` profile, and access to
the `atesmaps-terraform` S3 backend bucket (`eu-west-1`) — the same bucket
`platform` uses, under the `atesmaps/api` state key prefix so it doesn't
collide with `platform`'s own state or the `atesmaps` web repo's
`atesmaps/web` prefix.

`platform`'s `aws/common` (VPC, GitHub OIDC provider) must already be applied
before this config, since it looks up the OIDC provider via a `data` source.

## What this creates

- `module.ecr` (sourced from `platform`'s `tf-modules/aws/ecr`): the
  `atesmaps-prod-api` ECR repository.
- `aws_iam_role.gha` (`atesmaps-prod-api-gha-role`): assumable by this
  repository's GitHub Actions via the OIDC provider from `platform`'s
  `aws/common`. Scoped to: pushing images to `module.ecr`, `ssm:SendCommand`
  (+ related actions) to deploy via SSM Run Command, `ec2:DescribeInstances`
  to look up the shared EC2 host, and reading this service's own SSM
  parameters (`/atesmaps/prod/api/*`).
- `aws_ssm_parameter.*`: placeholders for this service's runtime config,
  under `/atesmaps/prod/api/`. Secrets (`SecureString`, value `"pending"`)
  must be set manually after `apply`, e.g.:
  ```bash
  aws ssm put-parameter --name /atesmaps/prod/api/ACCESS_TOKEN_SECRET \
    --type SecureString --overwrite --value '<value>' \
    --profile atesmaps --region eu-west-1
  ```

## Deploy flow (app container, not infra)

The actual container is deployed by `.github/workflows/deploy-prod.yml` in
this repository (not by `platform`'s CI, and not by this OpenTofu config):
it builds the image, pushes it to `module.ecr`, fetches this service's SSM
parameters into a generated `.env.atesmaps-api` file, and runs
`docker compose pull/up --no-deps atesmaps-api` on the shared EC2 host via
`aws ssm send-command` — no SSH, no SCP'd tarballs. The `atesmaps-api`
service itself must already be declared in `platform`'s
`compose/docker-compose.yml` (deployed separately by `platform`'s own CI).
