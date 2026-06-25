import { PubSub } from 'graphql-subscriptions';
import { RepositoryFactory } from '../../../infrastructure/repositories/RepositoryFactory.js';
import { GetTasksUseCase } from '../../../core/use-cases/GetTasks.js';
import { CreateTaskUseCase } from '../../../core/use-cases/CreateTask.js';
import { UpdateTaskUseCase } from '../../../core/use-cases/UpdateTask.js';
import { SprintModel, EpicModel, MilestoneModel, AutomationRuleModel } from '../../../infrastructure/database/MongoModels.js';

const pubsub = new PubSub();
const taskRepository = RepositoryFactory.getTaskRepository();
const auditLogRepository = RepositoryFactory.getAuditLogRepository();
const noteRepository = RepositoryFactory.getNoteRepository();
const projectRepository = RepositoryFactory.getProjectRepository();
const userRepository = RepositoryFactory.getUserRepository();
const notificationRepository = RepositoryFactory.getNotificationRepository();

const getTasksUC = new GetTasksUseCase(taskRepository);
const createTaskUC = new CreateTaskUseCase(taskRepository);
const updateTaskUC = new UpdateTaskUseCase(taskRepository);

export const resolvers = {
  Query: {
    tasks: (_: any, { projectId, status, priority, parentId, sprintId, epicId }: any) => {
      const filter: any = {};
      if (projectId) filter.projectId = projectId;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (parentId) filter.parentId = parentId;
      if (sprintId) filter.sprintId = sprintId;
      if (epicId) filter.epicId = epicId;
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
    notifications: (_: any, __: any, context: any) => {
      const auth0Id = context.userId;
      if (!auth0Id || auth0Id === 'guest-user') return [];
      return notificationRepository.findAllByUserId(auth0Id);
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
    },
    sprints: (_: any, { projectId }: any) => {
        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        return SprintModel.find(filter).sort({ startDate: -1 });
    },
    sprint: (_: any, { id }: any) => {
        return SprintModel.findById(id);
    },
    epics: (_: any, { projectId }: any) => {
        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        return EpicModel.find(filter).sort({ createdAt: -1 });
    },
    epic: (_: any, { id }: any) => {
        return EpicModel.findById(id);
    },
    milestones: (_: any, { projectId }: any) => {
        const filter: any = {};
        if (projectId) filter.projectId = projectId;
        return MilestoneModel.find(filter).sort({ date: 1 });
    },
    automationRules: (_: any, { projectId }: any) => {
        return AutomationRuleModel.find({ projectId });
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
    },
    parent: (parent: any) => {
      if (!parent.parentId) return null;
      return taskRepository.findById(parent.parentId);
    },
    subtasks: (parent: any) => {
      return taskRepository.findAll({ parentId: parent.id });
    },
    dependencies: async (parent: any) => {
      if (!parent.dependencyIds || parent.dependencyIds.length === 0) return [];
      const tasks = await Promise.all(parent.dependencyIds.map((id: string) => taskRepository.findById(id)));
      return tasks.filter(t => t !== null);
    },
    sprint: (parent: any) => {
        if (!parent.sprintId) return null;
        return SprintModel.findById(parent.sprintId);
    },
    epic: (parent: any) => {
        if (!parent.epicId) return null;
        return EpicModel.findById(parent.epicId);
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
    },
    sprints: (parent: any) => {
        return SprintModel.find({ projectId: parent.id });
    },
    epics: (parent: any) => {
        return EpicModel.find({ projectId: parent.id });
    },
    milestones: (parent: any) => {
        return MilestoneModel.find({ projectId: parent.id });
    },
    automationRules: (parent: any) => {
        return AutomationRuleModel.find({ projectId: parent.id });
    }
  },
  Sprint: {
      tasks: (parent: any) => {
          return taskRepository.findAll({ sprintId: parent.id });
      }
  },
  Epic: {
      tasks: (parent: any) => {
          return taskRepository.findAll({ epicId: parent.id });
      }
  },
  User: {
    manager: (parent: any) => {
      if (!parent.managerId) return null;
      return userRepository.findById(parent.managerId);
    },
    reports: (parent: any) => {
      return userRepository.findByManager(parent.id);
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

        // Trigger notification if assigned to someone else
        if (task.assigneeId && task.assigneeId !== userId) {
          const notification = await notificationRepository.create({
            userId: task.assigneeId,
            title: 'New Task Assigned',
            message: `You have been assigned to: ${task.title}`,
            type: 'TASK_ASSIGNED'
          });
          pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: notification });
        }

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

        // Simple Automation Engine Framework
        const rules = await AutomationRuleModel.find({ projectId: task.projectId, active: true });
        for (const rule of rules) {
            if (rule.trigger === 'STATUS_CHANGED' && updates.status) {
                if (rule.action === 'NOTIFY_ASSIGNEE' && task.assigneeId) {
                    const notification = await notificationRepository.create({
                        userId: task.assigneeId,
                        title: 'Automation Triggered',
                        message: `Status of ${task.title} changed to ${task.status}`,
                        type: 'AUTOMATION'
                    });
                    pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: notification });
                }
            }
        }

        // Notify assignee if status changed (manual)
        if (task.assigneeId && updates.status && updates.status !== oldTask?.status) {
          const notification = await notificationRepository.create({
            userId: task.assigneeId,
            title: 'Task Status Updated',
            message: `Task "${task.title}" is now ${task.status}`,
            type: 'TASK_STATUS_UPDATED'
          });
          pubsub.publish('NOTIFICATION_CREATED', { notificationCreated: notification });
        }

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
    },
    inviteUser: async (_: any, { email, name, role }: any, context: any) => {
      const existing = await userRepository.findByEmail(email);
      if (existing) return existing;

      const newUser = await userRepository.create({
        email,
        name,
        role: role || 'EMPLOYEE',
        auth0Id: `invited|${Date.now()}`, // Temporary ID
      });

      // Notify the invited user (simulated persistent notification)
      await notificationRepository.create({
        userId: newUser.auth0Id,
        title: 'Welcome to Zenith!',
        message: `You have been invited to join the workspace by ${context.userId || 'a team member'}.`,
        type: 'WORKSPACE_INVITE'
      });

      return newUser;
    },
    updateUserRole: (_: any, { id, role }: any) => {
      return userRepository.update(id, { role });
    },
    assignManager: (_: any, { userId, managerId }: any) => {
      return userRepository.update(userId, { managerId });
    },
    markNotificationAsRead: async (_: any, { id }: any) => {
      return notificationRepository.markAsRead(id);
    },
    markAllNotificationsAsRead: async (_: any, __: any, context: any) => {
      const auth0Id = context.userId;
      if (!auth0Id || auth0Id === 'guest-user') return false;
      return notificationRepository.markAllAsRead(auth0Id);
    },
    createSprint: async (_: any, args: any, context: any) => {
        const sprint = await SprintModel.create(args);
        pubsub.publish('SPRINT_CREATED', { sprintCreated: sprint });
        return sprint;
    },
    updateSprint: (_: any, { id, ...updates }: any) => {
        return SprintModel.findByIdAndUpdate(id, updates, { new: true });
    },
    createEpic: async (_: any, args: any) => {
        const epic = await EpicModel.create(args);
        pubsub.publish('EPIC_CREATED', { epicCreated: epic });
        return epic;
    },
    createMilestone: async (_: any, args: any) => {
        return MilestoneModel.create(args);
    },
    createAutomationRule: async (_: any, args: any) => {
        return AutomationRuleModel.create(args);
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
    },
    notificationCreated: {
      subscribe: () => (pubsub as any).asyncIterator(['NOTIFICATION_CREATED'])
    },
    sprintCreated: {
        subscribe: () => (pubsub as any).asyncIterator(['SPRINT_CREATED'])
    },
    epicCreated: {
        subscribe: () => (pubsub as any).asyncIterator(['EPIC_CREATED'])
    }
  }
};
