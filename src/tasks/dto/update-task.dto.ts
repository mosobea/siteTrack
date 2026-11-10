import { IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../../generated/prisma/client';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  // send null to unassign
  @IsOptional()
  @IsInt()
  assigneeId?: number | null;
}