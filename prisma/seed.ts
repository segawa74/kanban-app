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

export async function seedDatabase() {
  try {
    await main();
  } catch (e) {
    console.error(e);
    throw new Error("Failed to seed database");
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed.");
    })
    .catch((e) => {
      console.error("Seeding failed:", e);
      process.exit(1);
    });
}
