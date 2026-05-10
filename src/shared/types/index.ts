export type TaskStatus = "To Do" | "In Progress" | "Review" | "Completed" | "Backlog";
export type TaskPriority = "Low" | "Medium" | "High";
export type EnergyLevel = "Low" | "Medium" | "High";

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

  // Enterprise Enhancements
  parentId?: string;
  dependencyIds?: string[];
  estimate?: number;
  actualEffort?: number;
  energyLevel?: EnergyLevel;
  tags?: string[];
  sprintId?: string;

  subtasks?: Post[];
  dependencies?: Post[];
};

export type Sprint = {
    id: string;
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
    projectId: string;
    tasks?: Post[];
};

export type Stat = {
  title: string;
  value: number | string;
  diff: string;
  isPositive: boolean;
};
