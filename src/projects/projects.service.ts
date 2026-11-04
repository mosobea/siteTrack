import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Role } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/decorators/current-user.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // who can see a project
  private readWhere(user: AuthUser): Prisma.ProjectWhereInput {
    if (user.role === Role.ADMIN) return {};
    if (user.role === Role.MANAGER) return { ownerId: user.id };
    return { tasks: { some: { assigneeId: user.id } } };
  }

  // who can modify a project
  private writeWhere(user: AuthUser): Prisma.ProjectWhereInput {
    return user.role === Role.ADMIN ? {} : { ownerId: user.id };
  }

  create(user: AuthUser, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { ...dto, ownerId: user.id },
    });
  }

  findAll(user: AuthUser) {
    return this.prisma.project.findMany({
      where: this.readWhere(user),
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(user: AuthUser, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, ...this.readWhere(user) },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(user: AuthUser, id: number, dto: UpdateProjectDto) {
    await this.assertCanWrite(user, id);
    return this.prisma.project.update({ where: { id }, data: dto });
  }

  async remove(user: AuthUser, id: number) {
    await this.assertCanWrite(user, id);
    await this.prisma.project.delete({ where: { id } });
    return { deleted: true };
  }

  // helper method to check if the user can modify the project
  private async assertCanWrite(user: AuthUser, id: number) {
    const project = await this.prisma.project.findFirst({
      where: { id, ...this.writeWhere(user) },
      select: { id: true },
    });
    if (!project) throw new NotFoundException('Project not found or you do not have permission to modify it');
  }
}