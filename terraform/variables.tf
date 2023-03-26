variable "vercel_project_name" {
  type = string
}

variable "github_repository" {
  type = string
}

variable "vercel_environment_variables" {
  type = set(object({
    key    = string
    target = list(string)
    value  = string
  }))
  sensitive = true
}
