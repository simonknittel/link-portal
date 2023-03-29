vercel_project_name = "link-portal"
github_repository   = "simonknittel/link-portal"
vercel_environment_variables = [
  {
    key    = "NEXTAUTH_SECRET"
    target = ["production", "preview"]
    value  = ""
  },
  {
    key    = "DATABASE_URL"
    target = ["production", "preview"]
    value  = "mysql://user:password@host/link-portal"
  },
  {
    key    = "GITHUB_ID"
    target = ["production", "preview"]
    value  = ""
  },
  {
    key    = "GITHUB_SECRET"
    target = ["production", "preview"]
    value  = ""
  },
  {
    key    = "MAILGUN_API_KEY"
    target = ["production", "preview"]
    value  = ""
  },
  {
    key    = "MAILGUN_DOMAIN"
    target = ["production", "preview"]
    value  = ""
  }
]
