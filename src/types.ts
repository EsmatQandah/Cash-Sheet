export interface Holder {
  id: number;
  full_name: string;
  phone?: string | null;
  email?: string | null;
  national_id?: string | null;
  notes?: string | null;
}

export interface Bank {
  id: number;
  name: string;
  swift_code?: string | null;
}

export interface Currency {
  id: number;
  code: string;
  name: string;
}

export interface AccountType {
  id: number;
  name: string;
}

export interface Account {
  id: number;
  holder_id: number;
  bank_id: number;
  account_type_id: number;
  currency_id: number;
  account_number?: string | null;
  iban?: string | null;
  swift_code?: string | null;
  sort_code?: string | null;
  opening_date?: string | null;
  due_day?: number | null;
  notes?: string | null;
  holder_name?: string;
  bank_name?: string;
  account_type_name?: string;
  currency_code?: string;
}

export interface Deposit {
  id: number;
  account_id: number;
  principal_amount?: number | null;
  interest_rate?: number | null;
  tax_rate?: number | null;
  start_date?: string | null;
  maturity_date?: string | null;
  account_number?: string;
  holder_name?: string;
  bank_name?: string;
  days_remaining?: number;
}

export interface Transaction {
  id: number;
  account_id: number;
  date: string;
  description?: string | null;
  amount: number;
  type: "expense" | "payment";
  notes?: string | null;
  account_number?: string;
  holder_name?: string;
}

export interface CreditCardDue {
  id: number;
  account_number: string;
  due_day: number;
  holder_name: string;
  bank_name: string;
}

export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface AuthUser {
  id: number;
  username: string;
}

interface CrudApi<T> {
  list: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

export interface Api {
  auth: {
    login: (username: string, password: string) => Promise<AuthUser | null>;
  };
  holders: CrudApi<Holder>;
  banks: CrudApi<Bank>;
  currencies: CrudApi<Currency>;
  accountTypes: CrudApi<AccountType>;
  accounts: CrudApi<Account>;
  deposits: CrudApi<Deposit> & { upcoming: (days: number) => Promise<Deposit[]> };
  transactions: CrudApi<Transaction>;
  creditCards: { due: (days: number) => Promise<CreditCardDue[]> };
  users: {
    list: () => Promise<User[]>;
    create: (username: string, password: string) => Promise<User>;
    updatePassword: (id: number, password: string) => Promise<void>;
    remove: (id: number) => Promise<void>;
  };
}

declare global {
  interface Window {
    api: Api;
  }
}
