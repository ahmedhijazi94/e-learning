// src/enrollments/enrollments.service.ts

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { Course } from '../courses/entities/course.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentsRepository: Repository<Enrollment>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Matricular um estudante em um curso
  async enroll(createEnrollmentDto: CreateEnrollmentDto, studentId: string): Promise<Enrollment> {
    const { courseId } = createEnrollmentDto;

    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
      relations: ['professor'],
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    const student = await this.usersRepository.findOne({ where: { id: studentId } });

    if (!student) {
      throw new NotFoundException('Estudante não encontrado');
    }

    // Verificar se já está matriculado
    const existingEnrollment = await this.enrollmentsRepository.findOne({
      where: { course: { id: courseId }, student: { id: studentId } },
    });

    if (existingEnrollment) {
      throw new ConflictException('Você já está matriculado neste curso');
    }

    const enrollment = this.enrollmentsRepository.create({
      course,
      student,
    });

    return this.enrollmentsRepository.save(enrollment);
  }

  // Buscar matrículas de um estudante
  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { student: { id: studentId } },
      relations: ['course', 'course.professor'],
    });
  }

  // Buscar matrículas em um curso
  async findByCourse(courseId: string): Promise<Enrollment[]> {
    return this.enrollmentsRepository.find({
      where: { course: { id: courseId } },
      relations: ['student'],
    });
  }

  // Remover matrícula
  async remove(enrollmentId: string, studentId: string): Promise<void> {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: { id: enrollmentId },
      relations: ['student'],
    });

    if (!enrollment) {
      throw new NotFoundException('Matrícula não encontrada');
    }

    if (enrollment.student.id !== studentId) {
      throw new ForbiddenException('Você não tem permissão para remover esta matrícula');
    }

    await this.enrollmentsRepository.remove(enrollment);
  }
}
