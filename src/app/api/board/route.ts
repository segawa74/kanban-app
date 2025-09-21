import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const lists = await prisma.list.findMany({
      // Include related tasks for each list
      include: {
        tasks: {
          // Order tasks by their 'order' field
          orderBy: {
            order: "asc",
          },
        },
      },
      // Order lists by their 'order' field
      orderBy: {
        order: "asc",
      },
    });
    return NextResponse.json(lists);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching board" },
      { status: 500 }
    );
  }
}
