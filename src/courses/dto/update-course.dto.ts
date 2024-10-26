// src/courses/dto/update-course.dto.ts

import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiPropertyOptional({
    description: 'Título do curso',
    example: 'Introdução Avançada ao NestJS',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Descrição do curso',
    example: 'Este curso abrange conceitos avançados do NestJS.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
