export type Task = {
  id: string;
  title: string;
  order: number;
  listId: string;
  createdAt: string;
  updatedAt: string;
};

export type List = {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
};
