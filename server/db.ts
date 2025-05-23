import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

// Configuração para o Neon Database (PostgreSQL)
neonConfig.webSocketConstructor = ws;

// Verifica se a URL do banco de dados está definida
if (!process.env.DATABASE_URL) {
  console.warn('Aviso: DATABASE_URL não definida. Usando banco de dados de teste.');
}

// Criação do pool de conexões
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/gift_cards_nft' 
});

// Instância do Drizzle ORM
export const db = drizzle(pool, { schema });