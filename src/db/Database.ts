/**
 * I'm creating a singleton class to separate the database manager used from the logic itself,
 * so that later I can change Turso (the default) to another database manager.
 */

import type { SQLParam } from '../types/db/db.types.js';

import i18next from '../i18n/index.js';
import type { Client, Transaction } from '@libsql/client';

export class Database {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async query(sql: string, args: SQLParam[] = []) {
    try {
      const result = await this.client.execute({
        sql,
        args,
      });

      return result.rows ?? [];
    } catch (error) {
      console.log(i18next.t('query_error', { error }));
      throw error;
    }
  }

  async execute(sql: string, args: SQLParam[] = []) {
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

  async transaction(callback: (tx: Transaction) => Promise<any>) {
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
