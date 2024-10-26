// src/common/guards/owns-course.guard.ts

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CoursesService } from '../../courses/courses.service';
import { Request } from 'express';
import { Role } from '../../common/enums/role.enum';
import { User } from '../../users/entities/user.entity';


@Injectable()
export class OwnsCourseGuard implements CanActivate {
  constructor(private readonly coursesService: CoursesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const courseId = request.params.id;

    const course = await this.coursesService.findOne(courseId);

    if (user.role === Role.ADMIN) {
      return true;
    }

    if (course.professor.id !== user.id) {
      throw new ForbiddenException('Você não tem permissão para acessar este curso');
    }

    return true;
  }
}
