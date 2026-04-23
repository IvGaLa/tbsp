/**
 * I'm creating a singleton class to separate the database manager used from the logic itself,
 * so that later I can change Turso (the default) to another database manager.
 */

import type { ExecuteResult, SQLParam } from '../types/db/db.types.js';

import i18next from '../i18n/index.js';
import type { Client, Transaction } from '@libsql/client';

export class Database {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async query<T = unknown>(sql: string, args: SQLParam[] = []): Promise<T[]> {
    try {
      const result = await this.client.execute({
        sql,
        args,
      });

      return (result.rows ?? []) as T[];
    } catch (error) {
      console.log(i18next.t('query_error', { error }));
      throw error;
    }
  }

  async execute(sql: string, args: SQLParam[] = []): Promise<ExecuteResult> {
    try {
      const result = await this.client.execute({
        sql,
        args,
      });

      return {
        rowsAffected: result.rowsAffected ?? 0,
        lastInsertId: result.lastInsertRowid ?? null,
      };
    } catch (error) {
      console.log(i18next.t('execute_error', { error }));
      throw error;
    }
  }

  async transaction<T>(callback: (tx: Transaction) => Promise<any>): Promise<T> {
    const tx = await this.client.transaction();

    try {
      const result = await callback(tx);
      await tx.commit();
      return result;
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  }
}
