// src/courses/courses.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity';
import { OwnsCourseGuard } from '../common/guards/owns-course.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]), // Importa a entidade Course
    UsersModule, // Importa o UsersModule se necessário
  ],
  controllers: [CoursesController],
  providers: [CoursesService, OwnsCourseGuard],
  exports: [CoursesService], // Exporta o CoursesService se for usado em outros módulos
})
export class CoursesModule {}
