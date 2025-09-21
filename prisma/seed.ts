import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Delete all existing data
  await prisma.task.deleteMany({});
  await prisma.list.deleteMany({});
  console.log("Cleared the database.");

  // Create the default lists
  const todoList = await prisma.list.create({
    data: {
      title: "Todo",
      order: 0,
    },
  });

  const inProgressList = await prisma.list.create({
    data: {
      title: "In Progress",
      order: 1,
    },
  });

  const doneList = await prisma.list.create({
    data: {
      title: "Done",
      order: 2,
    },
  });

  console.log("Created default lists.");

  // Create sample tasks for each list
  await prisma.task.createMany({
    data: [
      // Tasks for "Todo"
      { title: "Review project requirements", listId: todoList.id, order: 0 },
      { title: "Design the database schema", listId: todoList.id, order: 1 },
      {
        title: "Set up the development environment",
        listId: todoList.id,
        order: 2,
      },

      // Tasks for "In Progress"
      {
        title: "Develop the user authentication API",
        listId: inProgressList.id,
        order: 0,
      },
      {
        title: "Build the main dashboard UI",
        listId: inProgressList.id,
        order: 1,
      },

      // Tasks for "Done"
      {
        title: "Create the project repository on GitHub",
        listId: doneList.id,
        order: 0,
      },
    ],
  });

  console.log("Created sample tasks.");
  console.log("Database has been seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });