import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($projectId: String, $parentId: String, $sprintId: String) {
    tasks(projectId: $projectId, parentId: $parentId, sprintId: $sprintId) {
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

      # Enterprise
      parentId
      dependencyIds
      estimate
      actualEffort
      energyLevel
      tags
      sprintId
      subtasks {
        id
        title
        status
      }
    }
  }
`;

export const GET_SPRINTS = gql`
  query GetSprints($projectId: String) {
    sprints(projectId: $projectId) {
      id
      name
      goal
      startDate
      endDate
      status
      projectId
      tasks {
        id
        estimate
        status
      }
    }
  }
`;

export const CREATE_SPRINT = gql`
  mutation CreateSprint($name: String!, $goal: String, $startDate: String!, $endDate: String!, $projectId: String!) {
    createSprint(name: $name, goal: $goal, startDate: $startDate, endDate: $endDate, projectId: $projectId) {
      id
      name
    }
  }
`;

export const UPDATE_SPRINT = gql`
  mutation UpdateSprint($id: ID!, $status: String) {
    updateSprint(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($entityType: String!, $entityId: String!) {
    auditLogs(entityType: $entityType, entityId: $entityId) {
      id
      action
      userId
      createdAt
      previousData
      newData
    }
  }
`;

export const INVITE_USER = gql`
  mutation InviteUser($email: String!, $name: String!, $role: UserRole) {
    inviteUser(email: $email, name: $name, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($id: ID!, $role: UserRole!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

export const ASSIGN_MANAGER = gql`
  mutation AssignManager($userId: ID!, $managerId: ID!) {
    assignManager(userId: $userId, managerId: $managerId) {
      id
      managerId
      manager {
        id
        name
      }
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      id
      title
      message
      type
      read
      createdAt
    }
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllRead {
    markAllNotificationsAsRead
  }
`;

export const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
  subscription OnNotificationCreated {
    notificationCreated {
      id
      title
      message
      type
      read
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
      role
      managerId
      manager {
        id
        name
      }
      reports {
        id
        name
      }
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
  mutation CreateTask(
    $title: String!,
    $projectId: String!,
    $description: String,
    $status: TaskStatus,
    $priority: TaskPriority,
    $dueDate: String,
    $assigneeId: String,
    $parentId: String,
    $dependencyIds: [String],
    $estimate: Int,
    $energyLevel: EnergyLevel,
    $tags: [String],
    $sprintId: String
  ) {
    createTask(
      title: $title,
      projectId: $projectId,
      description: $description,
      status: $status,
      priority: $priority,
      dueDate: $dueDate,
      assigneeId: $assigneeId,
      parentId: $parentId,
      dependencyIds: $dependencyIds,
      estimate: $estimate,
      energyLevel: $energyLevel,
      tags: $tags,
      sprintId: $sprintId
    ) {
      id
      title
      status
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!,
    $status: TaskStatus,
    $priority: TaskPriority,
    $title: String,
    $description: String,
    $dueDate: String,
    $assigneeId: String,
    $parentId: String,
    $dependencyIds: [String],
    $estimate: Int,
    $actualEffort: Int,
    $energyLevel: EnergyLevel,
    $tags: [String],
    $sprintId: String
  ) {
    updateTask(
      id: $id,
      status: $status,
      priority: $priority,
      title: $title,
      description: $description,
      dueDate: $dueDate,
      assigneeId: $assigneeId,
      parentId: $parentId,
      dependencyIds: $dependencyIds,
      estimate: $estimate,
      actualEffort: $actualEffort,
      energyLevel: $energyLevel,
      tags: $tags,
      sprintId: $sprintId
    ) {
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
