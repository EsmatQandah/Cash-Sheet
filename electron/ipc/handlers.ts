import { ipcMain } from "electron";
import { getDb } from "../db/connection";
import { buildRepositories } from "../db/repositories";

export function registerIpcHandlers(): void {
  const db = getDb();
  const repos = buildRepositories(db);

  ipcMain.handle("auth:login", (_e, username: string, password: string) => repos.users.login(username, password));

  ipcMain.handle("holders:list", () => repos.holders.list());
  ipcMain.handle("holders:create", (_e, data) => repos.holders.create(data));
  ipcMain.handle("holders:update", (_e, id, data) => repos.holders.update(id, data));
  ipcMain.handle("holders:remove", (_e, id) => repos.holders.remove(id));

  ipcMain.handle("banks:list", () => repos.banks.list());
  ipcMain.handle("banks:create", (_e, data) => repos.banks.create(data));
  ipcMain.handle("banks:update", (_e, id, data) => repos.banks.update(id, data));
  ipcMain.handle("banks:remove", (_e, id) => repos.banks.remove(id));

  ipcMain.handle("currencies:list", () => repos.currencies.list());
  ipcMain.handle("currencies:create", (_e, data) => repos.currencies.create(data));
  ipcMain.handle("currencies:update", (_e, id, data) => repos.currencies.update(id, data));
  ipcMain.handle("currencies:remove", (_e, id) => repos.currencies.remove(id));

  ipcMain.handle("accountTypes:list", () => repos.accountTypes.list());
  ipcMain.handle("accountTypes:create", (_e, data) => repos.accountTypes.create(data));
  ipcMain.handle("accountTypes:update", (_e, id, data) => repos.accountTypes.update(id, data));
  ipcMain.handle("accountTypes:remove", (_e, id) => repos.accountTypes.remove(id));

  ipcMain.handle("accounts:list", () => repos.accounts.list());
  ipcMain.handle("accounts:create", (_e, data) => repos.accounts.create(data));
  ipcMain.handle("accounts:update", (_e, id, data) => repos.accounts.update(id, data));
  ipcMain.handle("accounts:remove", (_e, id) => repos.accounts.remove(id));

  ipcMain.handle("deposits:list", () => repos.deposits.list());
  ipcMain.handle("deposits:upcoming", (_e, days) => repos.deposits.upcoming(days));
  ipcMain.handle("deposits:create", (_e, data) => repos.deposits.create(data));
  ipcMain.handle("deposits:update", (_e, id, data) => repos.deposits.update(id, data));
  ipcMain.handle("deposits:remove", (_e, id) => repos.deposits.remove(id));

  ipcMain.handle("transactions:list", () => repos.transactions.list());
  ipcMain.handle("transactions:create", (_e, data) => repos.transactions.create(data));
  ipcMain.handle("transactions:update", (_e, id, data) => repos.transactions.update(id, data));
  ipcMain.handle("transactions:remove", (_e, id) => repos.transactions.remove(id));

  ipcMain.handle("creditCards:due", (_e, days) => repos.creditCardsDue(days));

  ipcMain.handle("users:list", () => repos.users.list());
  ipcMain.handle("users:create", (_e, username, password) => repos.users.create(username, password));
  ipcMain.handle("users:updatePassword", (_e, id, password) => repos.users.updatePassword(id, password));
  ipcMain.handle("users:remove", (_e, id) => repos.users.remove(id));
}
