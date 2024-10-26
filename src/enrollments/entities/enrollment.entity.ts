// src/enrollments/entities/enrollment.entity.ts

import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';

@Entity()
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, course => course.enrollments, { eager: true })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @ManyToOne(() => User, user => user.enrollments, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: User;
}
