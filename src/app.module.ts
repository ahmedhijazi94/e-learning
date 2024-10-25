// src/app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Importação dos módulos funcionais
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// Adicione outros módulos conforme necessário




@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o ConfigModule disponível globalmente
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule
      inject: [ConfigService],  // Injeta o ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Use 'false' em produção e utilize migrações
      }),
    }),
    UsersModule, // Importa o módulo de usuários
    AuthModule,  // Importa o módulo de autenticação
    // Adicione outros módulos conforme necessário
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
