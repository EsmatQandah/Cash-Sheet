import React, { useEffect, useState } from "react";
import { useEntity } from "../hooks/useEntity";
import Modal from "../components/Modal";
import { useLanguage } from "../state/LanguageContext";
import type { Account, Deposit } from "../types";

const emptyForm = {
  account_id: "",
  principal_amount: "",
  interest_rate: "",
  tax_rate: "",
  start_date: "",
  maturity_date: "",
};

export default function Deposits() {
  const { rows, refresh, api } = useEntity(window.api.deposits);
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [editing, setEditing] = useState<Deposit | null>(null);
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

  function openEdit(deposit: Deposit) {
    setEditing(deposit);
    setForm({
      account_id: String(deposit.account_id),
      principal_amount: deposit.principal_amount != null ? String(deposit.principal_amount) : "",
      interest_rate: deposit.interest_rate != null ? String(deposit.interest_rate) : "",
      tax_rate: deposit.tax_rate != null ? String(deposit.tax_rate) : "",
      start_date: deposit.start_date ?? "",
      maturity_date: deposit.maturity_date ?? "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      account_id: Number(form.account_id),
      principal_amount: form.principal_amount ? Number(form.principal_amount) : null,
      interest_rate: form.interest_rate ? Number(form.interest_rate) : null,
      tax_rate: form.tax_rate ? Number(form.tax_rate) : null,
      start_date: form.start_date || null,
      maturity_date: form.maturity_date || null,
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
    if (!confirm(t("confirmDeleteDeposit"))) return;
    await api.remove(id);
    refresh();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t("depositsTitle")}</h1>
        <button onClick={openCreate}>{t("newDeposit")}</button>
      </div>

      <table className="simple-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("accountHolder")}</th>
            <th>{t("bank")}</th>
            <th>{t("accountNumber")}</th>
            <th>{t("principalAmount")}</th>
            <th>{t("interestRate")}</th>
            <th>{t("taxRate")}</th>
            <th>{t("startDate")}</th>
            <th>{t("maturityDate")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => (
            <tr key={d.id} onClick={() => openEdit(d)}>
              <td>{d.id}</td>
              <td>{d.holder_name}</td>
              <td>{d.bank_name}</td>
              <td>{d.account_number}</td>
              <td>{d.principal_amount}</td>
              <td>{d.interest_rate}</td>
              <td>{d.tax_rate}</td>
              <td>{d.start_date}</td>
              <td>{d.maturity_date}</td>
              <td>
                <button
                  className="danger small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(d.id);
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
        <Modal title={editing ? t("editDeposit") : t("newDeposit")} onClose={() => setShowModal(false)}>
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
              {t("principalAmount")}
              <input
                type="number"
                step="0.01"
                value={form.principal_amount}
                onChange={(e) => setForm({ ...form, principal_amount: e.target.value })}
              />
            </label>

            <label>
              {t("interestRate")}
              <input
                type="number"
                step="0.01"
                value={form.interest_rate}
                onChange={(e) => setForm({ ...form, interest_rate: e.target.value })}
              />
            </label>

            <label>
              {t("taxRate")}
              <input
                type="number"
                step="0.01"
                value={form.tax_rate}
                onChange={(e) => setForm({ ...form, tax_rate: e.target.value })}
              />
            </label>

            <label>
              {t("startDate")}
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </label>

            <label>
              {t("maturityDate")}
              <input
                type="date"
                value={form.maturity_date}
                onChange={(e) => setForm({ ...form, maturity_date: e.target.value })}
              />
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
