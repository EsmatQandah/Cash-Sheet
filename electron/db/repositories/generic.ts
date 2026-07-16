import Database from "better-sqlite3";

/**
 * Small helper for straightforward single-table CRUD repositories.
 * Not used for tables that need joins (accounts, deposits, transactions).
 */
export function makeCrudRepo<T extends Record<string, unknown>>(
  db: Database.Database,
  table: string,
  columns: string[]
) {
  const cols = columns.join(", ");

  return {
    list(): T[] {
      return db.prepare(`SELECT id, ${cols} FROM ${table} ORDER BY id`).all() as T[];
    },
    create(data: Partial<T>): T {
      // better-sqlite3 requires every named parameter used in the statement to be
      // present in the bound object, so fill any column not supplied with null.
      const fullData: Record<string, unknown> = {};
      for (const col of columns) fullData[col] = col in data ? (data as Record<string, unknown>)[col] : null;
      const placeholders = columns.map((c) => `@${c}`).join(", ");
      const info = db.prepare(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`).run(fullData);
      return db.prepare(`SELECT id, ${cols} FROM ${table} WHERE id = ?`).get(info.lastInsertRowid) as T;
    },
    update(id: number, data: Partial<T>): T {
      // Only update the columns actually provided (e.g. a single cell edit),
      // otherwise the missing named parameters would throw.
      const providedCols = columns.filter((c) => c in data);
      if (providedCols.length > 0) {
        const setClause = providedCols.map((c) => `${c} = @${c}`).join(", ");
        db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = @id`).run({ ...data, id });
      }
      return db.prepare(`SELECT id, ${cols} FROM ${table} WHERE id = ?`).get(id) as T;
    },
    remove(id: number): void {
      db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
    },
  };
}
