// src/users/dto/create-user.dto.ts

import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@elearning.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role do usuário',
    enum: Role,
    example: Role.STUDENT,
  })
  @IsEnum(Role, { message: 'Role inválida. As opções válidas são: admin, professor, student.' })
  role: Role;
}
