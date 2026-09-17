data "aws_iam_policy_document" "assume_role_gha" {
  statement {
    actions = [
      "sts:AssumeRoleWithWebIdentity",
    ]
    effect = "Allow"

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values = [
        "repo:${var.github_org}/${var.github_repository}:*",
      ]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    principals {
      identifiers = [
        data.aws_iam_openid_connect_provider.github.arn,
      ]
      type = "Federated"
    }
  }
}

resource "aws_iam_role" "gha" {
  assume_role_policy = data.aws_iam_policy_document.assume_role_gha.json
  description        = "The IAM role used by this repository's GitHub Actions to interact with this AWS account."
  name               = "${local.name}-${local.name_suffix}-gha-role"
}

data "aws_iam_policy_document" "gha" {
  statement {
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
    ]
    effect = "Allow"
    resources = [
      module.ecr.arn,
    ]
  }

  statement {
    actions = [
      "ecr:GetAuthorizationToken",
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  statement {
    actions = [
      "ssm:StartSession",
      "ssm:SendCommand",
      "ssm:DescribeInstanceInformation",
      "ssm:GetCommandInvocation",
      "ssm:TerminateSession",
    ]
    effect = "Allow"
    resources = [
      "arn:aws:ec2:${var.region}:${data.aws_caller_identity.current.account_id}:instance/*",
      "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:*",
      "arn:aws:ssm:${var.region}::document/AWS-StartSSHSession",
      "arn:aws:ssm:${var.region}::document/AWS-RunShellScript",
    ]
  }

  statement {
    actions = [
      "ec2:DescribeInstances",
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  statement {
    actions = [
      "ssm:GetParametersByPath",
      "ssm:GetParameter",
      "ssm:GetParameters",
    ]
    effect = "Allow"
    resources = [
      "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter${local.ssm_prefix}",
      "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter${local.ssm_prefix}/*",
    ]
  }
}

resource "aws_iam_role_policy" "gha" {
  name   = "${local.name}-${local.name_suffix}-gha-policy"
  policy = data.aws_iam_policy_document.gha.json
  role   = aws_iam_role.gha.id
}
