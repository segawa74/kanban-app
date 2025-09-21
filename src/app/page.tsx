"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  closestCorners,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskList } from "@/src/components/TaskList";
import { List, Task } from "@/src/types";
import { TaskCard } from "@/src/components/TaskCard";
import { AddListForm } from "@/src/components/AddListForm";

export default function BoardPage() {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeList, setActiveList] = useState<List | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // Require the mouse to move by 3 pixels before starting a drag
        // to avoid interfering with clicks
        distance: 3,
      },
    })
  );

  // Fetch initial board data
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch("/api/board");
        if (!res.ok) throw new Error("Failed to fetch board");
        const data: List[] = await res.json();
        setLists(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, []);

  // Find the list and task by their IDs
  const findListByTaskId = (taskId: string) =>
    lists.find((list) => list.tasks.some((task) => task.id === taskId));

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "List") {
      setActiveList(active.data.current.list);
      return;
    }

    if (active.data.current?.type === "Task") {
      const activeList = findListByTaskId(active.id as string);
      if (activeList) {
        setActiveTask(
          activeList.tasks.find((task) => task.id === active.id) || null
        );
      }
    }
  };

  const onDragOver = (event: DragOverEvent) => {};

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    setActiveList(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the original task details before any state changes
    const activeType = active.data.current?.type;
    if (activeType === "List") {
      const oldIndex = lists.findIndex((l) => l.id === activeId);
      const newIndex = lists.findIndex((l) => l.id === overId);

      if (oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);

        // API call to update list order
        await fetch("/api/lists", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lists: newLists }),
        });
      }
      return;
    }

    // Task Drag & Drop Logic
    const originalList = findListByTaskId(activeId);
    const originalTask = originalList?.tasks.find((t) => t.id === activeId);
    if (!originalTask) return;

    // Create a new state based on the final drop position
    const newLists = ((currentLists) => {
      const newListsState = JSON.parse(JSON.stringify(currentLists));

      const activeList = newListsState.find((l: List) =>
        l.tasks.some((t: Task) => t.id === activeId)
      );
      const overList =
        newListsState.find((l: List) =>
          l.tasks.some((t: Task) => t.id === overId)
        ) || newListsState.find((l: List) => l.id === overId);

      if (!activeList || !overList) return currentLists;

      if (activeList.id === overList.id) {
        // Reorder within the same list
        const oldIndex = activeList.tasks.findIndex(
          (t: Task) => t.id === activeId
        );
        const newIndex = overList.tasks.findIndex((t: Task) => t.id === overId);
        if (oldIndex !== newIndex) {
          activeList.tasks = arrayMove(activeList.tasks, oldIndex, newIndex);
        }
      } else {
        // Move to a different list
        const activeTaskIndex = activeList.tasks.findIndex(
          (t: Task) => t.id === activeId
        );
        const [movedTask] = activeList.tasks.splice(activeTaskIndex, 1);

        const overIsTask = over.data.current?.type === "Task";
        const overTaskIndex = overIsTask
          ? overList.tasks.findIndex((t: Task) => t.id === overId)
          : overList.tasks.length;

        overList.tasks.splice(overTaskIndex, 0, movedTask);
      }
      return newListsState;
    })(lists);

    // Optimistically update the UI
    setLists(newLists);

    // Find the final destination list and index from the new state
    const destinationList = newLists.find((l: List) =>
      l.tasks.some((t: Task) => t.id === activeId)
    );
    if (!destinationList) return;

    const newOrder = destinationList.tasks.findIndex((t: Task) => t.id === activeId);
    const newParentListId = destinationList.id;

    // Only call API if the position or list has actually changed
    if (
      originalTask.listId !== newParentListId ||
      originalTask.order !== newOrder
    ) {
      await fetch(`/api/tasks/${activeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listId: newParentListId,
          order: newOrder,
        }),
      });
    }
  };

  const handleUpdateList = async (listId: string, newTitle: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );

    await fetch(`/api/lists/${listId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
  };

  const onDeleteList = async (listId: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));

    await fetch(`/api/lists/${listId}`, {
      method: "DELETE",
    });
  };

  const handleAddList = async (title: string) => {
    const res = await fetch("/api/lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    if (res.ok) {
      const newList = await res.json();
      setLists((prevLists) => [
        ...prevLists,
        {
          ...newList,
          tasks: [],
        },
      ]);
    }
  };
  const handleUpdateTask = async (taskId: string, newTitle: string) => {
    setLists((prevLists) =>
      prevLists.map((list: List) => ({
        ...list,
        tasks: list.tasks.map((task: Task) =>
          task.id === taskId ? { ...task, title: newTitle } : task
        ),
      }))
    );

    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
      }),
    });
    // Note: For error handling or more accurate state synchronization,
    // you might want to refetch the board data after the API call.
    // await fetchBoard();
  };

  const handleDeleteTask = async (taskId: string) => {
    setLists((prevLists) =>
      prevLists.map((list: List) => ({
        ...list,
        tasks: list.tasks.filter((task: Task) => task.id !== taskId),
      }))
    );

    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
  };

  const handleAddTask = async (title: string, listId: string) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, listId }),
    });

    if (res.ok) {
      const newTask = await res.json();
      setLists((prevLists) => {
        const newLists = prevLists.map((list) => {
          if (list.id === listId) {
            return { ...list, tasks: [...list.tasks, newTask] };
          }
          return list;
        });
        return newLists;
      });
    }
  };
  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Kanban Board</h1>
        <div className="mb-6">
          <AddListForm onAddList={handleAddList} />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex space-x-4 overflow-x-auto pb-4">
            <SortableContext
              items={lists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {lists.map((list) => (
                <TaskList
                  key={list.id}
                  list={list}
                  onUpdateList={handleUpdateList}
                  onDeleteList={onDeleteList}
                  onDeleteTask={handleDeleteTask}
                  onAddTask={handleAddTask}
                  onUpdateTask={handleUpdateTask}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
      <DragOverlay>
        {activeList ? (
          <TaskList
            list={activeList}
            onUpdateList={() => {}}
            onDeleteList={() => {}}
            onDeleteTask={() => {}}
            onAddTask={() => {}}
            onUpdateTask={() => {}}
          />
        ) : activeTask ? (
          <div className="transform rotate-3">
            <TaskCard
              task={activeTask}
              onDelete={() => {}}
              onUpdate={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
