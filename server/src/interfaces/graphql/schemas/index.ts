export const typeDefs = `#graphql
  enum TaskStatus {
    TODO
    IN_PROGRESS
    REVIEW
    COMPLETED
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
  }

  enum UserRole {
    ADMIN
    MANAGER
    TEAM_LEAD
    EMPLOYEE
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: String
    projectId: String!
    assigneeId: String
    creatorId: String!
    createdAt: String!
    updatedAt: String!
    auditLogs: [AuditLog]
    notes: [Note]
    project: Project
    assignee: User
  }

  type Project {
    id: ID!
    name: String!
    description: String
    ownerId: String!
    teamIds: [String]
    createdAt: String!
    updatedAt: String!
    tasks: [Task]
    members: [User]
  }

  type User {
    id: ID!
    email: String!
    name: String!
    avatarUrl: String
    auth0Id: String!
    role: UserRole!
    managerId: String
    manager: User
    reports: [User]
    createdAt: String!
  }

  type AuditLog {
    id: ID!
    entityType: String!
    entityId: String!
    action: String!
    userId: String!
    previousData: String
    newData: String
    createdAt: String!
  }

  type Note {
    id: ID!
    title: String!
    content: String!
    taskId: String
    projectId: String
    creatorId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Notification {
    id: ID!
    userId: String!
    title: String!
    message: String!
    type: String!
    read: Boolean!
    createdAt: String!
  }

  type Analytics {
    totalTasks: Int!
    completedTasks: Int!
    inProgressTasks: Int!
    todoTasks: Int!
    reviewTasks: Int!
    priorityDistribution: PriorityDistribution!
  }

  type PriorityDistribution {
    low: Int!
    medium: Int!
    high: Int!
  }

  type Query {
    tasks(projectId: String, status: TaskStatus, priority: TaskPriority): [Task]
    task(id: ID!): Task
    projects: [Project]
    project(id: ID!): Project
    users: [User]
    me: User
    notes(projectId: String, taskId: String): [Note]
    auditLogs(entityType: String!, entityId: String!): [AuditLog]
    projectAnalytics(projectId: String!): Analytics
    notifications: [Notification]
  }

  type Mutation {
    createTask(
      title: String!
      description: String
      status: TaskStatus
      priority: TaskPriority
      dueDate: String
      projectId: String!
      assigneeId: String
    ): Task

    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      priority: TaskPriority
      dueDate: String
      assigneeId: String
    ): Task

    deleteTask(id: ID!): Boolean

    createProject(
      name: String!
      description: String
    ): Project

    updateProject(
      id: ID!
      name: String
      description: String
      teamIds: [String]
    ): Project

    deleteProject(id: ID!): Boolean

    createNote(
      title: String!
      content: String!
      taskId: String
      projectId: String
    ): Note

    updateNote(id: ID!, title: String, content: String): Note
    deleteNote(id: ID!): Boolean

    syncUser(email: String!, name: String!, avatarUrl: String): User
    inviteUser(email: String!, name: String!, role: UserRole): User
    updateUserRole(id: ID!, role: UserRole!): User
    assignManager(userId: ID!, managerId: ID!): User
    markNotificationAsRead(id: ID!): Notification
    markAllNotificationsAsRead: Boolean
  }

  type Subscription {
    taskCreated(projectId: String): Task
    taskUpdated(projectId: String): Task
    projectCreated: Project
    noteCreated(projectId: String, taskId: String): Note
    notificationCreated: Notification
  }
`;
