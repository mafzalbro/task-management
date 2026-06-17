export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type Post = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  assignee: string;
  assigneeId?: string;
};

export type Stat = {
  title: string;
  value: number | string;
  diff: string;
  isPositive: boolean;
};
