import { type Project } from "@prisma/client";
import * as formData from "form-data";
import Mailgun from "mailgun.js";
import { type Session } from "next-auth";
import { env } from "~/env.mjs";

export async function sendInviteEmail(
  to: string,
  project: Project,
  invitee: Session["user"]
) {
  if (!env.MAILGUN_API_KEY || !env.MAILGUN_DOMAIN) {
    console.warn("Mailgun API key or domain not set. Skipping email.");
    return;
  }

  const mailgun = new Mailgun(formData);

  const mg = mailgun.client({
    username: "api",
    key: env.MAILGUN_API_KEY,
    url: "https://api.eu.mailgun.net",
  });

  await mg.messages.create(env.MAILGUN_DOMAIN, {
    from: `Link Portal <noreply@${env.MAILGUN_DOMAIN}>`,
    to,
    subject: "You have been invited to a project | Link Portal",
    template: "invite_link-portal",
    "h:X-Mailgun-Variables": JSON.stringify({
      inviteeName: invitee.name,
      inviteeEmail: invitee.email,
      projectName: project.name,
      target: env.NEXTAUTH_URL,
    }),
  });
}
