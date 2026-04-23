export type SQLParam = string | number | null;

export type ExecuteResult = {
  rowsAffected: number;
  lastInsertId: bigint | null;
};
