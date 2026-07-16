import Database from "better-sqlite3";
import bcrypt from "bcryptjs";

export function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS holders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      national_id TEXT,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      swift_code TEXT
    );

    CREATE TABLE IF NOT EXISTS currencies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS account_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      holder_id INTEGER NOT NULL REFERENCES holders(id) ON DELETE RESTRICT,
      bank_id INTEGER NOT NULL REFERENCES banks(id) ON DELETE RESTRICT,
      account_type_id INTEGER NOT NULL REFERENCES account_types(id) ON DELETE RESTRICT,
      currency_id INTEGER NOT NULL REFERENCES currencies(id) ON DELETE RESTRICT,
      account_number TEXT,
      iban TEXT,
      swift_code TEXT,
      sort_code TEXT,
      opening_date TEXT,
      due_day INTEGER,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS deposits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL UNIQUE REFERENCES accounts(id) ON DELETE RESTRICT,
      principal_amount REAL,
      interest_rate REAL,
      tax_rate REAL,
      start_date TEXT,
      maturity_date TEXT
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE RESTRICT,
      date TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('expense', 'payment')),
      notes TEXT
    );
  `);

  seedDefaults(db);
}

function seedDefaults(db: Database.Database): void {
  const userCount = (db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number }).c;
  if (userCount === 0) {
    const hash = bcrypt.hashSync("admin", 10);
    db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run("admin", hash);
  }

  const currencyCount = (db.prepare("SELECT COUNT(*) AS c FROM currencies").get() as { c: number }).c;
  if (currencyCount === 0) {
    const insert = db.prepare("INSERT INTO currencies (code, name) VALUES (?, ?)");
    const defaults: [string, string][] = [
      ["USD", "US Dollar"],
      ["EUR", "Euro"],
      ["GBP", "British Pound"],
      ["JOD", "Jordanian Dinar"],
      ["SAR", "Saudi Riyal"],
      ["AED", "UAE Dirham"],
    ];
    for (const [code, name] of defaults) insert.run(code, name);
  }

  const typeCount = (db.prepare("SELECT COUNT(*) AS c FROM account_types").get() as { c: number }).c;
  if (typeCount === 0) {
    const insert = db.prepare("INSERT INTO account_types (name) VALUES (?)");
    for (const name of ["Current", "Savings", "Deposit", "Credit Card"]) insert.run(name);
  }
}
