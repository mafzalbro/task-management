import { PubSub } from 'graphql-subscriptions';
import { RepositoryFactory } from '../../../infrastructure/repositories/RepositoryFactory.js';
import { GetTasksUseCase } from '../../../core/use-cases/GetTasks.js';
import { CreateTaskUseCase } from '../../../core/use-cases/CreateTask.js';
import { UpdateTaskUseCase } from '../../../core/use-cases/UpdateTask.js';

const pubsub = new PubSub();
const taskRepository = RepositoryFactory.getTaskRepository();
const auditLogRepository = RepositoryFactory.getAuditLogRepository();
const noteRepository = RepositoryFactory.getNoteRepository();
const projectRepository = RepositoryFactory.getProjectRepository();
const userRepository = RepositoryFactory.getUserRepository();

const getTasksUC = new GetTasksUseCase(taskRepository);
const createTaskUC = new CreateTaskUseCase(taskRepository);
const updateTaskUC = new UpdateTaskUseCase(taskRepository);

export const resolvers = {
  Query: {
    tasks: (_: any, { projectId, status, priority }: any) => {
      const filter: any = {};
      if (projectId) filter.projectId = projectId;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      return getTasksUC.execute(filter);
    },
    task: (_: any, { id }: any) => {
      return taskRepository.findById(id);
    },
    projects: () => {
      return projectRepository.findAll();
    },
    project: (_: any, { id }: any) => {
      return projectRepository.findById(id);
    },
    users: () => {
      return userRepository.findAll();
    },
    me: (_: any, __: any, context: any) => {
      if (!context.userId || context.userId === 'guest-user') return null;
      return userRepository.findByAuth0Id(context.userId);
    },
    notes: (_: any, { projectId, taskId }: any) => {
      const filter: any = {};
      if (projectId) filter.projectId = projectId;
      if (taskId) filter.taskId = taskId;
      return noteRepository.findAll(filter);
    },
    auditLogs: (_: any, { entityType, entityId }: any) => {
      return auditLogRepository.findByEntity(entityType, entityId);
    },
    projectAnalytics: async (_: any, { projectId }: any) => {
      const tasks = await taskRepository.findAll({ projectId });
      const analytics = {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
        inProgressTasks: tasks.filter(t => t.status === 'IN_PROGRESS').length,
        todoTasks: tasks.filter(t => t.status === 'TODO').length,
        reviewTasks: tasks.filter(t => t.status === 'REVIEW').length,
        priorityDistribution: {
          low: tasks.filter(t => t.priority === 'LOW').length,
          medium: tasks.filter(t => t.priority === 'MEDIUM').length,
          high: tasks.filter(t => t.priority === 'HIGH').length,
        }
      };
      return analytics;
    }
  },
  Task: {
    auditLogs: (parent: any) => {
      return auditLogRepository.findByEntity('TASK', parent.id);
    },
    notes: (parent: any) => {
      return noteRepository.findAll({ taskId: parent.id });
    },
    project: (parent: any) => {
      return projectRepository.findById(parent.projectId);
    },
    assignee: (parent: any) => {
      if (!parent.assigneeId) return null;
      return userRepository.findByAuth0Id(parent.assigneeId);
    }
  },
  Project: {
    tasks: (parent: any) => {
      return taskRepository.findAll({ projectId: parent.id });
    },
    members: async (parent: any) => {
      if (!parent.teamIds) return [];
      const users = await Promise.all(parent.teamIds.map((id: string) => userRepository.findByAuth0Id(id)));
      return users.filter(u => u !== null);
    }
  },
  Mutation: {
    createTask: async (_: any, args: any, context: any) => {
      try {
        const userId = context.userId || 'system-user';
        const task = await createTaskUC.execute({ ...args, creatorId: userId });

      await auditLogRepository.create({
        entityType: 'TASK',
        entityId: task.id,
        action: 'CREATE',
        userId,
        newData: task
      });

        pubsub.publish('TASK_CREATED', { taskCreated: task });
        return task;
      } catch (err) {
        console.error('[Resolver Error] createTask:', err);
        throw err;
      }
    },
    updateTask: async (_: any, { id, ...updates }: any, context: any) => {
      try {
        const userId = context.userId || 'system-user';
        const oldTask = await taskRepository.findById(id);
        const task = await updateTaskUC.execute(id, updates);

      await auditLogRepository.create({
        entityType: 'TASK',
        entityId: id,
        action: 'UPDATE',
        userId,
        previousData: oldTask,
        newData: task
      });

        pubsub.publish('TASK_UPDATED', { taskUpdated: task });
        return task;
      } catch (err) {
        console.error('[Resolver Error] updateTask:', err);
        throw err;
      }
    },
    deleteTask: async (_: any, { id }: any, context: any) => {
      const userId = context.userId || 'system-user';
      const success = await taskRepository.delete(id);
      if (success) {
        await auditLogRepository.create({
          entityType: 'TASK',
          entityId: id,
          action: 'DELETE',
          userId
        });
      }
      return success;
    },
    createProject: async (_: any, args: any, context: any) => {
      const userId = context.userId || 'system-user';
      const project = await projectRepository.create({ ...args, ownerId: userId, teamIds: [userId] });
      pubsub.publish('PROJECT_CREATED', { projectCreated: project });
      return project;
    },
    updateProject: (_: any, { id, ...updates }: any) => {
      return projectRepository.update(id, updates);
    },
    deleteProject: (_: any, { id }: any) => {
      return projectRepository.delete(id);
    },
    createNote: async (_: any, args: any, context: any) => {
      const userId = context.userId || 'system-user';
      const note = await noteRepository.create({ ...args, creatorId: userId });
      pubsub.publish('NOTE_CREATED', { noteCreated: note });
      return note;
    },
    updateNote: (_: any, { id, ...updates }: any) => {
      return noteRepository.update(id, updates);
    },
    deleteNote: (_: any, { id }: any) => {
      return noteRepository.delete(id);
    },
    syncUser: async (_: any, args: any, context: any) => {
      const auth0Id = context.userId;
      if (!auth0Id || auth0Id === 'guest-user') throw new Error('Unauthorized');

      let user = await userRepository.findByAuth0Id(auth0Id);
      if (user) {
        // Update user if needed
        return user;
      }
      return userRepository.create({ ...args, auth0Id });
    }
  },
  Subscription: {
    taskCreated: {
      subscribe: () => (pubsub as any).asyncIterator(['TASK_CREATED'])
    },
    taskUpdated: {
      subscribe: () => (pubsub as any).asyncIterator(['TASK_UPDATED'])
    },
    projectCreated: {
      subscribe: () => (pubsub as any).asyncIterator(['PROJECT_CREATED'])
    },
    noteCreated: {
      subscribe: () => (pubsub as any).asyncIterator(['NOTE_CREATED'])
    }
  }
};
