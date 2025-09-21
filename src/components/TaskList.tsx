import { useState, useRef, useEffect } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { List } from "@/src/types";
import { TaskCard } from "./TaskCard";
import { AddTaskForm } from "./AddTaskForm";

type TaskListProps = {
  list: List;
  onUpdateList: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (title: string, listId: string) => void;
  onUpdateTask: (taskId: string, newTitle: string) => void;
};

export const TaskList = ({
  list,
  onUpdateList,
  onDeleteList,
  onDeleteTask,
  onAddTask,
  onUpdateTask,
}: TaskListProps) => {
  const { setNodeRef } = useDroppable({ id: list.id });
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (editedTitle.trim() && editedTitle !== list.title) {
      onUpdateList(list.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditedTitle(list.title);
      setIsEditing(false);
    }
  };

  return (
    <SortableContext
      id={list.id}
      items={list.tasks.map((task) => task.id)}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setSortableNodeRef} style={style} className="w-80 shrink-0">
        <div
          ref={setNodeRef}
          className="bg-zinc-200/70 dark:bg-zinc-800/70 rounded-lg p-3 flex flex-col max-h-[calc(100vh-120px)]"
        >
          <div
            {...attributes}
            {...listeners}
            className="p-1 flex justify-between items-center cursor-grab"
            onDoubleClick={() => setIsEditing(true)}
          >
            {isEditing ? (
              <input
                ref={inputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full p-1 rounded-md bg-white dark:bg-zinc-800 border border-blue-500 focus:outline-none text-lg font-bold"
              />
            ) : (
              <h2 className="text-lg font-bold">{list.title}</h2>
            )}
            <button
              onClick={() => onDeleteList(list.id)}
              className="ml-2 px-2 py-1 text-gray-500 hover:text-red-500 rounded-md opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
          <div className="p-1 mt-1">
            <AddTaskForm listId={list.id} onAddTask={onAddTask} />
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-300 dark:border-zinc-700/60 overflow-y-auto flex-grow">
            <div className="space-y-3">
              {list.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={onDeleteTask}
                  onUpdate={onUpdateTask}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SortableContext>
  );
};
