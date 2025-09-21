import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { title, listId } = await request.json();

    if (!title || !listId) {
      return NextResponse.json(
        { error: "Title and listId are required" },
        { status: 400 }
      );
    }

    // To add a new task to the end of the list, we first need to find the highest 'order' value.
    const maxOrderTask = await prisma.task.findFirst({
      where: { listId },
      orderBy: { order: "desc" },
    });

    // The new order will be the highest order + 1, or 0 if the list is empty.
    const newOrder = maxOrderTask ? maxOrderTask.order + 1 : 0;

    const task = await prisma.task.create({
      data: { title, listId, order: newOrder },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Error creating task" }, { status: 500 });
  }
}
