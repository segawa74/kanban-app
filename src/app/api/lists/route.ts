import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const maxOrderList = await prisma.list.findFirst({
      orderBy: {
        order: "desc",
      },
    });

    const newOrder = maxOrderList ? maxOrderList.order + 1 : 0;

    const newList = await prisma.list.create({
      data: {
        title,
        order: newOrder,
      },
    });

    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create list" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { lists } = await req.json();

    if (!Array.isArray(lists)) {
      return NextResponse.json(
        { error: "Invalid input, expected an array of lists" },
        { status: 400 }
      );
    }

    const transaction = lists.map((list, index) =>
      prisma.list.update({
        where: { id: list.id },
        data: { order: index },
      })
    );

    await prisma.$transaction(transaction);

    return NextResponse.json({ message: "List order updated successfully" });
  } catch (error) {
    console.error("Error updating list order:", error);
    return NextResponse.json(
      { error: "Failed to update list order" },
      { status: 500 }
    );
  }
}
