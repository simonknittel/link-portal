import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  id: string;
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  // TODO: Check if user is project member

  try {
    const body = await request.json();

    const newValue = body.favourited ? "true" : "false";

    const createdItem = await prisma.linkUserKeyValue.upsert({
      create: {
        userId: session.user.id,
        linkId: params.id,
        key: "favourited",
        value: newValue,
      },
      update: {
        value: newValue,
      },
      where: {
        linkId_userId_key: {
          userId: session.user.id,
          linkId: params.id,
          key: "favourited",
        },
      },
    });

    return NextResponse.json(createdItem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
