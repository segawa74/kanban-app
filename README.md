# Next.js & Prisma Kanban Board

A modern, full-stack Kanban board application built with Next.js, React, TypeScript, and Prisma. This project features intuitive drag-and-drop functionality for both tasks and lists, persistent state management with a PostgreSQL database, and a clean, responsive UI styled with Tailwind CSS.


## ✨ Features

- **Full CRUD for Lists & Tasks**: Create, rename, and delete lists (columns) and tasks directly from the UI.
- **Intuitive Drag & Drop**:
  - Seamlessly reorder tasks within the same list.
  - Move tasks between different lists.
  - Reorder entire lists across the board.
- **Persistent State**: All changes are immediately saved to a PostgreSQL database via Prisma ORM, ensuring data integrity.
- **Dark/Light Mode**: Theme toggling for user preference, with styles managed by Tailwind CSS.
- **Type-Safe Codebase**: Built entirely with TypeScript for a robust, maintainable, and error-free development experience.
- **Database Seeding**: Includes a Prisma seed script to easily populate the board with sample data for demonstration.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router & API Routes)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Drag & Drop**: [dnd-kit](https://dndkit.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.18 or later)
- [pnpm](https://pnpm.io/installation) (or your preferred package manager)
- A running [PostgreSQL](https://www.postgresql.org/download/) database instance

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/kanban-app-next.git
    cd kanban-app-next
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your database connection string:

    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
    ```

4.  **Run database migrations:**
    This will create the necessary tables in your database based on the Prisma schema.

    ```bash
    npx prisma migrate dev
    ```

5.  **Seed the database with sample data (optional):**
    To populate the board with initial lists and tasks for a better demo experience.

    ```bash
    npx prisma db seed
    ```

6.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at http://localhost:3000.

## 📝 API Endpoints

The application uses Next.js API Routes to handle backend logic.

- `GET /api/board`: Fetches all lists and their associated tasks.
- `POST /api/lists`: Creates a new list.
- `PUT /api/lists`: Updates the order of all lists.
- `PUT /api/lists/[id]`: Renames a list.
- `DELETE /api/lists/[id]`: Deletes a list and its tasks.
- `POST /api/tasks`: Creates a new task.
- `PUT /api/tasks/[id]`: Updates a task's title, list, or order.
- `DELETE /api/tasks/[id]`: Deletes a task.

## 🔮 Future Improvements

- **User Authentication**: Implement user sign-up and login to create private boards.
- **Task Details Modal**: Add a modal to view and edit task details, including descriptions and attachments.
- **Due Dates & Priorities**: Add metadata to tasks like due dates and priority levels (High, Medium, Low).
- **Real-time Collaboration**: Use WebSockets to reflect changes instantly for all connected users.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
