import { type Project } from "@prisma/client";
import * as formData from "form-data";
import Mailgun from "mailgun.js";
import { type Session } from "next-auth";
import { env } from "~/env.mjs";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: env.MAILGUN_API_KEY,
  url: "https://api.eu.mailgun.net",
});

export async function sendInviteEmail(
  to: string,
  project: Project,
  invitee: Session["user"]
) {
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
