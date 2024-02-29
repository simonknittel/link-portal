terraform {
  required_version = "1.7.4"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "0.15.1"
    }
  }
}

provider "vercel" {}

resource "vercel_project" "main" {
  framework                  = "nextjs"
  name                       = var.vercel_project_name
  root_directory             = "app"
  serverless_function_region = "fra1"

  git_repository = {
    productiproduction_branch = "main"
    type                      = "github"
    repo                      = var.github_repository
  }

  environment = var.vercel_environment_variables
}
