// src/users/dto/update-user.dto.ts

import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'novoemail@elearning.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário',
    example: 'novaSenhaSegura123',
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({
    description: 'Role do usuário',
    enum: Role,
    example: Role.STUDENT,
  })
  @IsEnum(Role, { message: 'Role inválida. As opções válidas são: admin, professor, student.' })
  @IsOptional()
  role?: Role;
}
