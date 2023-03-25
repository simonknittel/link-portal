import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const item = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const item = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    const body = await request.json();

    await prisma.tag.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  try {
    const item = await prisma.tag.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!item) return NextResponse.json({}, { status: 404 });

    if (
      session.user.projectMemberships.some(
        (projectMembership) => projectMembership.projectId === item.projectId
      ) === false
    )
      return NextResponse.json({}, { status: 401 });

    await prisma.tag.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
