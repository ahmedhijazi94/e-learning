// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança
  app.use(helmet());

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
