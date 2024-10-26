// src/enrollments/enrollments.controller.ts

import { Controller, Post, Body, UseGuards, Req, Get, Param, Delete, ForbiddenException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Enrollment } from './entities/enrollment.entity';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
import { CoursesService } from '../courses/courses.service'; // Importação adicionada


@ApiTags('enrollments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService, // Injeção adicionada
  ) {}

  @Roles(Role.STUDENT, Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Matricular-se em um curso' })
  @ApiResponse({ status: 201, description: 'Matrícula criada com sucesso.', type: Enrollment })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Curso ou estudante não encontrado.' })
  @ApiResponse({ status: 409, description: 'Já está matriculado neste curso.' })
  async enroll(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @Req() req: Request,
  ): Promise<Enrollment> {
    const user = req.user as User;
    return this.enrollmentsService.enroll(createEnrollmentDto, user.id);
  }

  @Roles(Role.STUDENT, Role.ADMIN)
  @Get('me')
  @ApiOperation({ summary: 'Buscar minhas matrículas' })
  @ApiResponse({ status: 200, description: 'Lista de matrículas.', type: [Enrollment] })
  async findMyEnrollments(@Req() req: Request): Promise<Enrollment[]> {
    const user = req.user as User;
    return this.enrollmentsService.findByStudent(user.id);
  }

  @Roles(Role.PROFESSOR, Role.ADMIN)
  @Get('course/:courseId')
  @ApiOperation({ summary: 'Buscar matrículas em um curso' })
  @ApiResponse({ status: 200, description: 'Lista de matrículas.', type: [Enrollment] })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async findByCourse(
    @Param('courseId') courseId: string,
    @Req() req: Request,
  ): Promise<Enrollment[]> {
    const user = req.user as User;

    // Se o usuário é professor, verificar se ele é o dono do curso
    if (user.role === Role.PROFESSOR) {
      const course = await this.coursesService.findOne(courseId);
      if (course.professor.id !== user.id) {
        throw new ForbiddenException('Você não tem permissão para acessar as matrículas deste curso');
      }
    }

    return this.enrollmentsService.findByCourse(courseId);
  }

  @Roles(Role.STUDENT, Role.ADMIN)
  @Delete(':enrollmentId')
  @ApiOperation({ summary: 'Remover uma matrícula' })
  @ApiResponse({ status: 200, description: 'Matrícula removida com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Matrícula não encontrada.' })
  async remove(
    @Param('enrollmentId') enrollmentId: string,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user as User;
    return this.enrollmentsService.remove(enrollmentId, user.id);
  }
}
