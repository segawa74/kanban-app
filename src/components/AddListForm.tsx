"use client";

import { useState, FormEvent } from "react";

type AddListFormProps = {
  onAddList: (title: string) => void;
};

export const AddListForm = ({ onAddList }: AddListFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddList(title.trim());
    setTitle("");
  };

  return (
    <div className="w-80 shrink-0">
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-lg flex items-center gap-2"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter list title..."
          className="w-full p-2 rounded-md bg-white/80 dark:bg-zinc-700/50 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed shrink-0"
        >
          Add List
        </button>
      </form>
    </div>
  );
};
