import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface IParams {
  taskId?: string;
}

// Handler for updating a task (e.g., changing its title, list, or order)
export async function PUT(request: Request, { params }: { params: IParams }) {
  try {
    const { taskId } = params;
    const { title, listId, order } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        // Conditionally include fields in the update only if they are provided
        ...(title && { title }),
        ...(listId && { listId }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}

// Handler for deleting a task
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  try {
    const { taskId } = params;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({ where: { id: taskId } });

    // Return a 204 No Content response on successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting task" }, { status: 500 });
  }
}
