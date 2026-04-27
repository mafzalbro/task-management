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

  type Query {
    tasks(projectId: String): [Task]
    task(id: ID!): Task
    projects: [Project]
    project(id: ID!): Project
    users: [User]
    me: User
    notes(projectId: String, taskId: String): [Note]
    auditLogs(entityType: String!, entityId: String!): [AuditLog]
  }

  type Mutation {
    createTask(
      title: String!
      description: String
      status: TaskStatus
      priority: TaskPriority
      projectId: String!
      assigneeId: String
    ): Task

    updateTask(
      id: ID!
      title: String
      description: String
      status: TaskStatus
      priority: TaskPriority
      assigneeId: String
    ): Task

    deleteTask(id: ID!): Boolean

    createProject(
      name: String!
      description: String
    ): Project

    createNote(
      title: String!
      content: String!
      taskId: String
      projectId: String
    ): Note

    updateNote(id: ID!, title: String, content: String): Note
    deleteNote(id: ID!): Boolean

    syncUser(email: String!, name: String!, avatarUrl: String): User
  }

  type Subscription {
    taskCreated(projectId: String): Task
    taskUpdated(projectId: String): Task
    projectCreated: Project
    noteCreated(projectId: String, taskId: String): Note
  }
`;
