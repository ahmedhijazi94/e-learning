// src/common/filters/http-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Verificar se a exceção é uma HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      // Verificar se responseBody é um objeto
      if (typeof responseBody === 'object' && responseBody !== null) {
        response.status(status).json({
          statusCode: status,
          ...responseBody,
        });
      } else {
        response.status(status).json({
          statusCode: status,
          message: exception.message,
        });
      }
    } else {
      // Para exceções não tratadas
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocorreu um erro inesperado no servidor.',
      });
    }
  }
}
