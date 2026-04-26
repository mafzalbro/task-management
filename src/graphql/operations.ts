import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($projectId: String) {
    tasks(projectId: $projectId) {
      id
      title
      description
      status
      priority
      dueDate
      projectId
      assigneeId
      creatorId
      createdAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $projectId: String!, $description: String, $status: TaskStatus, $priority: TaskPriority) {
    createTask(title: $title, projectId: $projectId, description: $description, status: $status, priority: $priority) {
      id
      title
      status
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $status: TaskStatus, $priority: TaskPriority, $title: String, $description: String) {
    updateTask(id: $id, status: $status, priority: $priority, title: $title, description: $description) {
      id
      title
      status
      priority
    }
  }
`;

export const TASK_CREATED_SUBSCRIPTION = gql`
  subscription OnTaskCreated($projectId: String) {
    taskCreated(projectId: $projectId) {
      id
      title
      status
    }
  }
`;
