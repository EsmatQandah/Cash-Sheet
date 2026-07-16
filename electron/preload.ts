import { contextBridge, ipcRenderer } from "electron";

function crud(entity: string) {
  return {
    list: () => ipcRenderer.invoke(`${entity}:list`),
    create: (data: unknown) => ipcRenderer.invoke(`${entity}:create`, data),
    update: (id: number, data: unknown) => ipcRenderer.invoke(`${entity}:update`, id, data),
    remove: (id: number) => ipcRenderer.invoke(`${entity}:remove`, id),
  };
}

contextBridge.exposeInMainWorld("api", {
  auth: {
    login: (username: string, password: string) => ipcRenderer.invoke("auth:login", username, password),
  },
  holders: crud("holders"),
  banks: crud("banks"),
  currencies: crud("currencies"),
  accountTypes: crud("accountTypes"),
  accounts: crud("accounts"),
  deposits: {
    ...crud("deposits"),
    upcoming: (days: number) => ipcRenderer.invoke("deposits:upcoming", days),
  },
  transactions: crud("transactions"),
  creditCards: {
    due: (days: number) => ipcRenderer.invoke("creditCards:due", days),
  },
  users: {
    list: () => ipcRenderer.invoke("users:list"),
    create: (username: string, password: string) => ipcRenderer.invoke("users:create", username, password),
    updatePassword: (id: number, password: string) => ipcRenderer.invoke("users:updatePassword", id, password),
    remove: (id: number) => ipcRenderer.invoke("users:remove", id),
  },
});
