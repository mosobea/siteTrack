import { Injectable, 
        BadRequestException, 
        ForbiddenException, 
        NotFoundException 
    } from '@nestjs/common';
import { Prisma, Role } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) {}

    private readWhere(user: AuthUser): Prisma.TaskWhereInput{
        if (user.role === Role.ADMIN) return {};
        if (user.role === Role.MANAGER) return { project: { ownerId: user.id } };
        return { assigneeId: user.id };
    }

    private async assertAssignee(assigneeId: number){
        const exists = await this.prisma.user.findUnique({ 
            where: { id: assigneeId, select: { id: true },} });
            if(!exists) throw new BadRequestException(`User with id ${assigneeId} does not exist`);
        }

    async create(user: AuthUser, projectId: number, dto: CreateTaskDto) {
        const project = await this.prisma.project.findFirst({
        where: user.role === Role.ADMIN ? { id: projectId } : { id: projectId, ownerId: user.id },
        select: { id: true },
        });
         if (!project) throw new NotFoundException('Project not found');

     if (dto.assigneeId !== undefined) await this.assertAssignee(dto.assigneeId);
        return this.prisma.task.create({ data: { ...dto, projectId } });
    }

     async findAll(user: AuthUser, projectId: number, query: QueryTasksDto) {
    const { status, assigneeId, page, limit } = query;


     // Build conditions based on project, user permissions, and optional filters (status, assigneeId)
    const where: Prisma.TaskWhereInput = {
      AND: [
        { projectId },
        this.readWhere(user),
        ...(status ? [{ status }] : []),
        ...(assigneeId ? [{ assigneeId }] : []),
      ],
    };

    // Get tasks and count matching records in one transaction
    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
        // include basic information about the assigned user
        include: { assignee: { select: { id: true, name: true, email: true } } },
      }),
      // count all matching tasks
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(user: AuthUser, id: number) {
    const task = await this.prisma.task.findFirst({
      where: { id, ...this.readWhere(user) },
      include: { assignee: { select: { id: true, name: true, email: true } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(user: AuthUser, id: number, dto: UpdateTaskDto) {
    const task = await this.findOne(user, id);

    if (
      user.role === Role.WORKER &&
      (dto.title !== undefined || dto.assigneeId !== undefined)
    ) {
      throw new ForbiddenException('Workers can only update task status');
    }

    if (typeof dto.assigneeId === 'number') {
      await this.assertAssignee(dto.assigneeId);
    }

    return this.prisma.task.update({ where: { id: task.id }, data: dto });
  }

  async remove(user: AuthUser, id: number) {
    const task = await this.findOne(user, id);
    await this.prisma.task.delete({ where: { id: task.id } });
    return { deleted: true };
  }

}
