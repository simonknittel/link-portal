import { type Session } from "next-auth";
import { prisma } from "~/server/db";

const actions = ["create", "read", "update", "delete"] as const;
type Actions = (typeof actions)[number];

const resourceTypes = ["Project", "ProjectMember", "Tag", "Link"] as const;
type ResourceTypes = (typeof resourceTypes)[number];

export async function authorize<T extends Actions>(
  user: Session["user"],
  action: T,
  resourceType: ResourceTypes,
  resource: { projectId: string }
) {
  if (!user) return false;

  if (resourceType === "Project") {
    if (action === "create") {
      return true;
    } else if (["read", "update", "delete"].includes(action)) {
      const projectMembership = await prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: resource.projectId,
            userId: user.id,
          },
        },
      });

      if (!projectMembership) return false;

      if (action === "read") {
        return true;
      } else if (["update", "delete"].includes(action)) {
        return projectMembership.role === 2;
      }
    }
  } else if (["ProjectMember", "Tag", "Link"].includes(resourceType)) {
    const projectMembership = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId: resource.projectId,
          userId: user.id,
        },
      },
    });

    if (!projectMembership) return false;

    if (action === "read") {
      return true;
    } else if (["create", "update", "delete"].includes(action)) {
      return projectMembership.role === 2;
    }
  }

  return false;
}
