import type { Request, Response } from "express";
import { prisma } from "../db/prisma.js";
import { createTaskSchema } from "../types/task.types.js";
import { updateTaskSchema } from "../types/task.types.js";
import { TaskService } from "../services/task.service.js";
import { Status } from "../generated/prisma/enums.js";
import { io } from "../index.js";

const taskService = new TaskService();

export const createTask = async (req: Request, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) return res.status(401).json({ message: "Unauthorized" });

    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid task data",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const task = await taskService.createTask(parsed.data, creatorId);

    if (task.assignedToId && task.assignedToId !== creatorId) {
      const notification = await prisma.notification.create({
        data: {
          userId: task.assignedToId,
          taskId: task.id,
          type: "TASK_ASSIGNED",
          message: `You have been assigned a new task: "${task.title}"`,
        },
      });

      io.to(task.assignedToId).emit("task-assigned", notification);
    }

    return res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error: any) {
    if (error.message === "ASSIGNED_USER_NOT_FOUND")
      return res.status(404).json({ message: "Assigned user not found" });

    console.error(error);
    return res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { status, priority, sort, order } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ creatorId: userId }, { assignedToId: userId }],
        ...(status && { status: status as any }),
        ...(priority && { priority: priority as any }),
      },
      orderBy: {
        [sort === "dueDate" ? "dueDate" : "createdAt"]:
          order === "asc" ? "asc" : "desc",
      },
    });

    return res.status(200).json({ tasks });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    const tasks = await prisma.task.findMany({
      where: {
        OR: [{ creatorId: userId }, { assignedToId: userId }],
        dueDate: {
          lt: now,
        },
        status: {
          not: Status.COMPLETED,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch overdue tasks" });
  }
};

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    const [assignedToMe, createdByMe, overdue] = await Promise.all([
      prisma.task.findMany({
        where: { assignedToId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.findMany({
        where: { creatorId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.findMany({
        where: {
          OR: [{ creatorId: userId }, { assignedToId: userId }],
          dueDate: { lt: now },
          status: { not: "COMPLETED" },
        },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    return res.status(200).json({
      assignedToMe,
      createdByMe,
      overdue,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load dashboard" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!taskId)
      return res.status(400).json({ message: "Task id is required" });

    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid update data",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.creatorId !== userId && task.assignedToId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    if (parsed.data.assignedToId) {
      const userExists = await prisma.user.findUnique({
        where: { id: parsed.data.assignedToId },
        select: { id: true },
      });

      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const updateData: any = {};

    if (parsed.data.title !== undefined) updateData.title = parsed.data.title;

    if (parsed.data.description !== undefined)
      updateData.description = parsed.data.description;

    if (parsed.data.priority !== undefined)
      updateData.priority = parsed.data.priority;

    if (parsed.data.status !== undefined)
      updateData.status = parsed.data.status;

    if (parsed.data.assignedToId !== undefined)
      updateData.assignedToId = parsed.data.assignedToId;

    if (parsed.data.dueDate !== undefined)
      updateData.dueDate = new Date(parsed.data.dueDate);

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    io.emit("task-updated", {
      taskId: updatedTask.id,
      status: updatedTask.status,
      priority: updatedTask.priority,
      assignedToId: updatedTask.assignedToId,
    });

    if (
      parsed.data.assignedToId &&
      parsed.data.assignedToId !== task.creatorId
    ) {
      const notification = await prisma.notification.create({
        data: {
          userId: parsed.data.assignedToId,
          taskId: updatedTask.id,
          type: "TASK_ASSIGNED",
          message: `You have been assigned a new task: "${updatedTask.title}"`,
        },
      });

      io.to(parsed.data.assignedToId).emit("task-assigned", notification);
    }

    return res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update task" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!taskId)
      return res.status(401).json({ message: "Task Id is required" });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.creatorId !== userId && task.assignedToId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    return res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch task" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!taskId)
      return res.status(400).json({ message: "Task id is required" });

    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.creatorId !== userId)
      return res.status(403).json({ message: "Only creator can delete task" });

    await prisma.notification.deleteMany({
      where: { taskId },
    });

    await prisma.task.delete({
      where: { id: taskId },
    });

    io.emit("task-deleted", { taskId });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
