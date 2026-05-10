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
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: "Active" | "In Review" | "Planned" | "Completed";
  color: string;
  members: number;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  status: "online" | "away" | "busy" | "offline";
  statusLabel: string;
  tasks: number;
  initials: string;
  color: string;
  email: string;
};

export type Stat = {
  title: string;
  value: number | string;
  diff: string;
  isPositive: boolean;
};
