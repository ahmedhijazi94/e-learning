// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe, HttpStatus, HttpException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança
  app.use(helmet());

  // Configuração do Validation Pipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não possuem decorators de validação
    forbidNonWhitelisted: true, // Retorna erro se existirem propriedades não validadas
    transform: true, // Transforma as requisições para os tipos esperados nos DTOs
    exceptionFactory: (errors) => {
      const messages = errors.map(
        (error) => `${error.property} - ${Object.values(error.constraints).join(', ')}`,
      );
      return new HttpException({ message: messages }, HttpStatus.BAD_REQUEST);
    },
  }));

  // Aplicar o filtro de exceção globalmente
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('e-Learning API')
    .setDescription('API para gerenciamento de cursos, alunos, professores e exames')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte a autenticação via Bearer Token
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // A documentação estará disponível em /api-docs

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
