import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { authorize } from "../authorize";
import errorHandler from "../errorHandler";

const postSchema = z.object({
  projectId: z.string().cuid2(),
  title: z.string().min(1).max(255),
  description: z.string().max(255).optional(),
  href: z.string().url(),
  tagIds: z.array(z.string().cuid2()).optional(),
});

export async function POST(request: Request) {
  try {
    /**
     * Authenticate the request. Make sure only authenticated users can continue.
     */
    const session = await getServerSession(authOptions);
    if (!session) throw new Error("Unauthorized");

    /**
     * Get the request body
     */
    const body: unknown = await request.json();

    /**
     * Validate the request body
     */
    const data = await postSchema.parseAsync(body);

    /**
     * Authorize the request. Make sure only project members can continue.
     */
    if (
      !(await authorize(session.user, "create", "Link", {
        projectId: data.projectId,
      }))
    )
      throw new Error("Unauthorized");

    /**
     * Create
     */
    const createdItem = await prisma.link.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        description: data.description,
        href: data.href,
        tags: {
          connect: data.tagIds?.map((tagId) => ({ id: tagId })) || [],
        },
      },
    });

    return NextResponse.json(createdItem);
  } catch (error) {
    return errorHandler(error);
  }
}
