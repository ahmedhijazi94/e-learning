// src/auth/jwt-payload.interface.ts

export interface JwtPayload {
  username: string;
  sub: string; // ID do usuário
}