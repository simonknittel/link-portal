import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { authorize } from "../_utils/authorize";
import errorHandler from "../_utils/errorHandler";

const postBodySchema = z.object({
  name: z.string(),
  slug: z.string(),
});

export async function POST(request: Request) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can create.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "create", "Project", { projectId: "" }))
    )
      throw new Error("Unauthorized");

    /**
     * Validate the request body
     */
    const body: unknown = await request.json();
    const data = await postBodySchema.parseAsync(body);

    /**
     * TODO: Check demo limits
     */

    /**
     * Create
     */
    const createdProject = await prisma.project.create({
      data: {
        name: data.name,
        slug: data.slug,
      },
    });

    await prisma.projectMember.create({
      data: {
        projectId: createdProject.id,
        userId: session.user.id,
        role: 2,
      },
    });

    return NextResponse.json(createdProject);
  } catch (error) {
    return errorHandler(error);
  }
}
