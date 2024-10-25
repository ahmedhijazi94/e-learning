// src/users/users.controller.ts

import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Aplicar guards globalmente no controlador
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // criar usuario
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 409, description: 'Email já está em uso.' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  //listar usuarios
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Buscar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários.', type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }


  //listar 1 usuario
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do usuário.', type: User })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  //atualizar usuario
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.', type: User })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiResponse({ status: 409, description: 'Email já está em uso.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  //excluir usuario
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover um usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
