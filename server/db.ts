import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configuração para o Neon Database (PostgreSQL)
neonConfig.webSocketConstructor = ws;

// Verifica se a URL do banco de dados está definida
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL deve ser definida no ambiente.');
}

// Criação do pool de conexões
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Instância do Drizzle ORM
export const db = drizzle(pool, { schema });