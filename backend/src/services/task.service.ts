import {prisma} from "../db/prisma.js"
import type { CreateTaskInput } from "../types/task.types.js"

export class TaskService{
    async createTask(
        data: CreateTaskInput,
        creatorId: string,
    ) {
        const assignedUser = await prisma.user.findUnique({
      where: { id: data.assignedToId },
      select: { id: true },
    });

    if (!assignedUser) {
      throw new Error("ASSIGNED_USER_NOT_FOUND");
    }

    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority,
        creatorId,
        assignedToId: data.assignedToId,
      },
    });
    }
}