// src/courses/courses.service.ts

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  // Criar um novo curso
  async create(createCourseDto: CreateCourseDto, professorId: string): Promise<Course> {
    const course = this.coursesRepository.create({
      ...createCourseDto,
      professor: { id: professorId } as User,
    });
    return this.coursesRepository.save(course);
  }

  // Buscar todos os cursos
  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find({ relations: ['professor'] });
  }

  // Buscar curso por ID
  async findOne(id: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: ['professor'],
    });
    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }
    return course;
  }

  // Atualizar um curso
  async update(id: string, updateCourseDto: UpdateCourseDto, professorId: string): Promise<Course> {
    const course = await this.findOne(id);

    // Verificar se o professor é o dono do curso
    if (course.professor.id !== professorId) {
      throw new ForbiddenException('Você não tem permissão para atualizar este curso');
    }

    Object.assign(course, updateCourseDto);
    return this.coursesRepository.save(course);
  }

  // Remover um curso
  async remove(id: string, professorId: string): Promise<void> {
    const course = await this.findOne(id);

    // Verificar se o professor é o dono do curso
    if (course.professor.id !== professorId) {
      throw new ForbiddenException('Você não tem permissão para remover este curso');
    }

    await this.coursesRepository.remove(course);
  }

  // Buscar cursos por professor
  async findByProfessor(professorId: string): Promise<Course[]> {
    return this.coursesRepository.find({
      where: { professor: { id: professorId } },
      relations: ['professor'],
    });
  }
}
