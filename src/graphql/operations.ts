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
      assignee {
        id
        name
      }
      creatorId
      createdAt
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
      description
      ownerId
      teamIds
      createdAt
      tasks {
        id
        status
      }
      members {
        id
        name
      }
    }
  }
`;

export const GET_TEAM = gql`
  query GetTeam {
    users {
      id
      name
      email
      avatarUrl
      createdAt
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String) {
    createProject(name: $name, description: $description) {
      id
      name
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($title: String!, $projectId: String!, $description: String, $status: TaskStatus, $priority: TaskPriority, $dueDate: String, $assigneeId: String) {
    createTask(title: $title, projectId: $projectId, description: $description, status: $status, priority: $priority, dueDate: $dueDate, assigneeId: $assigneeId) {
      id
      title
      status
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $status: TaskStatus, $priority: TaskPriority, $title: String, $description: String, $dueDate: String, $assigneeId: String) {
    updateTask(id: $id, status: $status, priority: $priority, title: $title, description: $description, dueDate: $dueDate, assigneeId: $assigneeId) {
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

export const SYNC_USER = gql`
  mutation SyncUser($email: String!, $name: String!, $avatarUrl: String) {
    syncUser(email: $email, name: $name, avatarUrl: $avatarUrl) {
      id
      name
    }
  }
`;
