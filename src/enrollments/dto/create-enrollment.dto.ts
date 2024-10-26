// src/enrollments/dto/create-enrollment.dto.ts

import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
  @ApiProperty({
    description: 'ID do curso para matricular-se',
    example: 'uuid-do-curso',
  })
  @IsUUID()
  courseId: string;
}
