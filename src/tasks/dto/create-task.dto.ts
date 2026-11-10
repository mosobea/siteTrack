import { IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../../generated/prisma/client';

export class CreateTaskDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  assigneeId?: number;
}