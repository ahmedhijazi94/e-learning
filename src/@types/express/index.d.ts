// src/@types/express/index.d.ts

import { User } from '../../users/entities/user.entity'; // Ajuste o caminho conforme a estrutura do seu projeto

declare global {
  namespace Express {
    interface Request {
      user?: User; // Defina o tipo correto para 'user'
    }
  }
}
