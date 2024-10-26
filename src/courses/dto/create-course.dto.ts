// src/courses/dto/create-course.dto.ts

import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Título do curso',
    example: 'Introdução ao NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Descrição do curso',
    example: 'Este curso abrange os fundamentos do NestJS.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
