// src/courses/courses.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { OwnsCourseGuard } from '../common/guards/owns-course.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Course } from './entities/course.entity';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';


@ApiTags('courses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Roles(Role.PROFESSOR, Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar um novo curso' })
  @ApiResponse({ status: 201, description: 'Curso criado com sucesso.', type: Course })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  async create(@Body() createCourseDto: CreateCourseDto, @Req() req: Request): Promise<Course> {
    const user = req.user as User; // Usuário autenticado
    return this.coursesService.create(createCourseDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar todos os cursos' })
  @ApiResponse({ status: 200, description: 'Lista de cursos.', type: [Course] })
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um curso por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do curso.', type: Course })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Roles(Role.PROFESSOR, Role.ADMIN)
  @Put(':id')
  @UseGuards(OwnsCourseGuard)
  @ApiOperation({ summary: 'Atualizar um curso' })
  @ApiResponse({ status: 200, description: 'Curso atualizado com sucesso.', type: Course })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Req() req: Request,
  ): Promise<Course> {
    const user = req.user as User;
    return this.coursesService.update(id, updateCourseDto, user.id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um curso' })
  @ApiResponse({ status: 200, description: 'Curso removido com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  @ApiResponse({ status: 404, description: 'Curso não encontrado.' })
  async remove(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const user = req.user as User;
    return this.coursesService.remove(id, user.id);
  }
}
