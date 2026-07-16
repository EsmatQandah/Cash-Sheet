import React, { useEffect, useState } from "react";
import { useAuth } from "../state/AuthContext";
import { useLanguage } from "../state/LanguageContext";
import type { User } from "../types";

export default function UsersSettings() {
  const { user: currentUser } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordEdits, setPasswordEdits] = useState<Record<number, string>>({});
  const [error, setError] = useState("");

  function refresh() {
    window.api.users.list().then(setUsers);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!newUsername.trim() || !newPassword.trim()) return;
    try {
      await window.api.users.create(newUsername.trim(), newPassword);
      setNewUsername("");
      setNewPassword("");
      refresh();
    } catch (err) {
      setError(t("addUserError"));
    }
  }

  async function handleUpdatePassword(id: number) {
    const pwd = passwordEdits[id];
    if (!pwd) return;
    await window.api.users.updatePassword(id, pwd);
    setPasswordEdits({ ...passwordEdits, [id]: "" });
  }

  async function handleDelete(id: number) {
    if (id === currentUser?.id) {
      alert(t("cannotDeleteSelf"));
      return;
    }
    if (!confirm(t("confirmDeleteUser"))) return;
    await window.api.users.remove(id);
    refresh();
  }

  return (
    <div className="page">
      <h1>{t("usersTitle")}</h1>

      <table className="simple-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("username")}</th>
            <th>{t("createdAt")}</th>
            <th>{t("newPassword")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.created_at}</td>
              <td>
                <input
                  type="password"
                  placeholder={t("newPassword")}
                  value={passwordEdits[u.id] ?? ""}
                  onChange={(e) => setPasswordEdits({ ...passwordEdits, [u.id]: e.target.value })}
                />
                <button className="small" onClick={() => handleUpdatePassword(u.id)}>
                  {t("update")}
                </button>
              </td>
              <td>
                <button className="danger small" onClick={() => handleDelete(u.id)}>
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>{t("addNewUser")}</h2>
      <form className="entity-form inline-form" onSubmit={handleAddUser}>
        <label>
          {t("username")}
          <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
        </label>
        <label>
          {t("password")}
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
        </label>
        <div className="form-actions">
          <button type="submit">{t("addUser")}</button>
        </div>
      </form>
      {error && <div className="login-error">{error}</div>}
    </div>
  );
}
