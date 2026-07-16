import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { makeCrudRepo } from "./generic";

export function buildRepositories(db: Database.Database) {
  const holders = makeCrudRepo(db, "holders", ["full_name", "phone", "email", "national_id", "notes"]);
  const banks = makeCrudRepo(db, "banks", ["name", "swift_code"]);
  const currencies = makeCrudRepo(db, "currencies", ["code", "name"]);
  const accountTypes = makeCrudRepo(db, "account_types", ["name"]);

  const accountColumns = [
    "holder_id",
    "bank_id",
    "account_type_id",
    "currency_id",
    "account_number",
    "iban",
    "swift_code",
    "sort_code",
    "opening_date",
    "due_day",
    "notes",
  ];
  const accountsBase = makeCrudRepo(db, "accounts", accountColumns);

  const accountSelect = `
    SELECT a.id, a.holder_id, a.bank_id, a.account_type_id, a.currency_id,
           a.account_number, a.iban, a.swift_code, a.sort_code, a.opening_date,
           a.due_day, a.notes,
           h.full_name AS holder_name, b.name AS bank_name,
           t.name AS account_type_name, c.code AS currency_code
    FROM accounts a
    JOIN holders h ON h.id = a.holder_id
    JOIN banks b ON b.id = a.bank_id
    JOIN account_types t ON t.id = a.account_type_id
    JOIN currencies c ON c.id = a.currency_id
  `;

  const accounts = {
    ...accountsBase,
    list() {
      return db.prepare(`${accountSelect} ORDER BY a.id`).all();
    },
  };

  const depositColumns = ["account_id", "principal_amount", "interest_rate", "tax_rate", "start_date", "maturity_date"];
  const depositsBase = makeCrudRepo(db, "deposits", depositColumns);
  const deposits = {
    ...depositsBase,
    list() {
      return db
        .prepare(
          `SELECT d.*, a.account_number, h.full_name AS holder_name, bnk.name AS bank_name
           FROM deposits d
           JOIN accounts a ON a.id = d.account_id
           JOIN holders h ON h.id = a.holder_id
           JOIN banks bnk ON bnk.id = a.bank_id
           ORDER BY d.maturity_date`
        )
        .all();
    },
    upcoming(days: number) {
      return db
        .prepare(
          `SELECT d.*, a.account_number, h.full_name AS holder_name, bnk.name AS bank_name,
                  CAST(julianday(d.maturity_date) - julianday('now') AS INTEGER) AS days_remaining
           FROM deposits d
           JOIN accounts a ON a.id = d.account_id
           JOIN holders h ON h.id = a.holder_id
           JOIN banks bnk ON bnk.id = a.bank_id
           WHERE julianday(d.maturity_date) - julianday('now') <= ?
           ORDER BY d.maturity_date`
        )
        .all(days);
    },
  };

  const transactionColumns = ["account_id", "date", "description", "amount", "type", "notes"];
  const transactionsBase = makeCrudRepo(db, "transactions", transactionColumns);
  const transactions = {
    ...transactionsBase,
    list() {
      return db
        .prepare(
          `SELECT tr.*, a.account_number, h.full_name AS holder_name
           FROM transactions tr
           JOIN accounts a ON a.id = tr.account_id
           JOIN holders h ON h.id = a.holder_id
           ORDER BY tr.date DESC, tr.id DESC`
        )
        .all();
    },
  };

  const creditCardsDue = (days: number) =>
    db
      .prepare(
        `SELECT a.id, a.account_number, a.due_day, h.full_name AS holder_name, bnk.name AS bank_name
         FROM accounts a
         JOIN account_types t ON t.id = a.account_type_id
         JOIN holders h ON h.id = a.holder_id
         JOIN banks bnk ON bnk.id = a.bank_id
         WHERE t.name = 'Credit Card' AND a.due_day IS NOT NULL`
      )
      .all() as { id: number; account_number: string; due_day: number; holder_name: string; bank_name: string }[];

  const users = {
    list() {
      return db.prepare("SELECT id, username, created_at FROM users ORDER BY id").all();
    },
    create(username: string, password: string) {
      const hash = bcrypt.hashSync(password, 10);
      const info = db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, hash);
      return db.prepare("SELECT id, username, created_at FROM users WHERE id = ?").get(info.lastInsertRowid);
    },
    updatePassword(id: number, password: string) {
      const hash = bcrypt.hashSync(password, 10);
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(hash, id);
    },
    remove(id: number) {
      db.prepare("DELETE FROM users WHERE id = ?").run(id);
    },
    login(username: string, password: string) {
      const row = db.prepare("SELECT id, username, password_hash FROM users WHERE username = ?").get(username) as
        | { id: number; username: string; password_hash: string }
        | undefined;
      if (!row) return null;
      const ok = bcrypt.compareSync(password, row.password_hash);
      if (!ok) return null;
      return { id: row.id, username: row.username };
    },
  };

  return { holders, banks, currencies, accountTypes, accounts, deposits, transactions, users, creditCardsDue };
}

export type Repositories = ReturnType<typeof buildRepositories>;
