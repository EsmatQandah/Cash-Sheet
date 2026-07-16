import React, { useEffect, useState } from "react";
import { useEntity } from "../hooks/useEntity";
import Modal from "../components/Modal";
import { useLanguage } from "../state/LanguageContext";
import type { Account, Transaction } from "../types";

const emptyForm = {
  account_id: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  amount: "",
  type: "expense" as "expense" | "payment",
  notes: "",
};

export default function Transactions() {
  const { rows, refresh, api } = useEntity(window.api.transactions);
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    window.api.accounts.list().then(setAccounts);
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(tr: Transaction) {
    setEditing(tr);
    setForm({
      account_id: String(tr.account_id),
      date: tr.date,
      description: tr.description ?? "",
      amount: String(tr.amount),
      type: tr.type,
      notes: tr.notes ?? "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      account_id: Number(form.account_id),
      date: form.date,
      description: form.description || null,
      amount: Number(form.amount),
      type: form.type,
      notes: form.notes || null,
    };
    if (editing) {
      await api.update(editing.id, payload);
    } else {
      await api.create(payload);
    }
    setShowModal(false);
    refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm(t("confirmDeleteTransaction"))) return;
    await api.remove(id);
    refresh();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t("transactionsTitle")}</h1>
        <button onClick={openCreate}>{t("newTransaction")}</button>
      </div>

      <table className="simple-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("date")}</th>
            <th>{t("accountHolder")}</th>
            <th>{t("accountNumber")}</th>
            <th>{t("description")}</th>
            <th>{t("amount")}</th>
            <th>{t("type")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tr) => (
            <tr key={tr.id} onClick={() => openEdit(tr)}>
              <td>{tr.id}</td>
              <td>{tr.date}</td>
              <td>{tr.holder_name}</td>
              <td>{tr.account_number}</td>
              <td>{tr.description}</td>
              <td>{tr.amount}</td>
              <td>{tr.type === "expense" ? t("typeExpense") : t("typePayment")}</td>
              <td>
                <button
                  className="danger small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(tr.id);
                  }}
                >
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal title={editing ? t("editTransaction") : t("newTransaction")} onClose={() => setShowModal(false)}>
          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              {t("account")}
              <select
                required
                value={form.account_id}
                onChange={(e) => setForm({ ...form, account_id: e.target.value })}
              >
                <option value="" disabled>
                  {t("choose")}
                </option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.holder_name} - {a.bank_name} - {a.account_number}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t("date")}
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </label>

            <label>
              {t("type")}
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "expense" | "payment" })}>
                <option value="expense">{t("typeExpense")}</option>
                <option value="payment">{t("typePayment")}</option>
              </select>
            </label>

            <label>
              {t("amount")}
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </label>

            <label>
              {t("description")}
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </label>

            <label>
              {t("notes")}
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>

            <div className="form-actions">
              <button type="submit">{t("save")}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
