import { PubSub } from "graphql-subscriptions";
import { RepositoryFactory } from "../../../infrastructure/repositories/RepositoryFactory.js";
import { GetTasksUseCase } from "../../../core/use-cases/GetTasks.js";
import { CreateTaskUseCase } from "../../../core/use-cases/CreateTask.js";
import { UpdateTaskUseCase } from "../../../core/use-cases/UpdateTask.js";

const pubsub = new PubSub();
const taskRepository = RepositoryFactory.getTaskRepository();
const auditLogRepository = RepositoryFactory.getAuditLogRepository();
const noteRepository = RepositoryFactory.getNoteRepository();

const getTasksUC = new GetTasksUseCase(taskRepository);
const createTaskUC = new CreateTaskUseCase(taskRepository);
const updateTaskUC = new UpdateTaskUseCase(taskRepository);

export const resolvers = {
  Query: {
    tasks: (_: any, { projectId }: any) => {
      const filter = projectId ? { projectId } : {};
      return getTasksUC.execute(filter);
    },
    task: (_: any, { id }: any) => {
      return taskRepository.findById(id);
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
  },
  Task: {
    auditLogs: (parent: any) => {
      return auditLogRepository.findByEntity("TASK", parent.id);
    },
    notes: (parent: any) => {
      return noteRepository.findAll({ taskId: parent.id });
    },
  },
  Mutation: {
    createTask: async (_: any, args: any, context: any) => {
      const userId = context.userId || "system-user";
      const task = await createTaskUC.execute({ ...args, creatorId: userId });

      await auditLogRepository.create({
        entityType: "TASK",
        entityId: task.id,
        action: "CREATE",
        userId,
        newData: task,
      });

      pubsub.publish("TASK_CREATED", { taskCreated: task });
      return task;
    },
    updateTask: async (_: any, { id, ...updates }: any, context: any) => {
      const userId = context.userId || "system-user";
      const oldTask = await taskRepository.findById(id);
      const task = await updateTaskUC.execute(id, updates);

      await auditLogRepository.create({
        entityType: "TASK",
        entityId: id,
        action: "UPDATE",
        userId,
        previousData: oldTask,
        newData: task,
      });

      pubsub.publish("TASK_UPDATED", { taskUpdated: task });
      return task;
    },
    deleteTask: async (_: any, { id }: any, context: any) => {
      const userId = context.userId || "system-user";
      const success = await taskRepository.delete(id);
      if (success) {
        await auditLogRepository.create({
          entityType: "TASK",
          entityId: id,
          action: "DELETE",
          userId,
        });
      }
      return success;
    },
    createNote: async (_: any, args: any, context: any) => {
      const userId = context.userId || "system-user";
      const note = await noteRepository.create({ ...args, creatorId: userId });
      pubsub.publish("NOTE_CREATED", { noteCreated: note });
      return note;
    },
    updateNote: (_: any, { id, ...updates }: any) => {
      return noteRepository.update(id, updates);
    },
    deleteNote: (_: any, { id }: any) => {
      return noteRepository.delete(id);
    },
  },
  Subscription: {
    taskCreated: {
      subscribe: () => (pubsub as any).asyncIterator(["TASK_CREATED"]),
    },
    taskUpdated: {
      subscribe: () => (pubsub as any).asyncIterator(["TASK_UPDATED"]),
    },
    noteCreated: {
      subscribe: () => (pubsub as any).asyncIterator(["NOTE_CREATED"]),
    },
  },
};
