import React, { useEffect, useState } from "react";
import { useEntity } from "../hooks/useEntity";
import Modal from "../components/Modal";
import { useLanguage } from "../state/LanguageContext";
import type { Account, Bank, Currency, AccountType, Holder } from "../types";

const emptyForm = {
  holder_id: "",
  bank_id: "",
  account_type_id: "",
  currency_id: "",
  account_number: "",
  iban: "",
  swift_code: "",
  sort_code: "",
  opening_date: "",
  due_day: "",
  notes: "",
};

export default function Accounts() {
  const { rows, refresh, api } = useEntity(window.api.accounts);
  const { t } = useLanguage();
  const [holders, setHolders] = useState<Holder[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [types, setTypes] = useState<AccountType[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [editing, setEditing] = useState<Account | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    window.api.holders.list().then(setHolders);
    window.api.banks.list().then(setBanks);
    window.api.accountTypes.list().then(setTypes);
    window.api.currencies.list().then(setCurrencies);
  }, []);

  const selectedTypeName = types.find((t) => String(t.id) === form.account_type_id)?.name;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(account: Account) {
    setEditing(account);
    setForm({
      holder_id: String(account.holder_id),
      bank_id: String(account.bank_id),
      account_type_id: String(account.account_type_id),
      currency_id: String(account.currency_id),
      account_number: account.account_number ?? "",
      iban: account.iban ?? "",
      swift_code: account.swift_code ?? "",
      sort_code: account.sort_code ?? "",
      opening_date: account.opening_date ?? "",
      due_day: account.due_day != null ? String(account.due_day) : "",
      notes: account.notes ?? "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      holder_id: Number(form.holder_id),
      bank_id: Number(form.bank_id),
      account_type_id: Number(form.account_type_id),
      currency_id: Number(form.currency_id),
      account_number: form.account_number || null,
      iban: form.iban || null,
      swift_code: form.swift_code || null,
      sort_code: form.sort_code || null,
      opening_date: form.opening_date || null,
      due_day: form.due_day ? Number(form.due_day) : null,
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
    if (!confirm(t("confirmDeleteAccount"))) return;
    await api.remove(id);
    refresh();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{t("accountsTitle")}</h1>
        <button onClick={openCreate}>{t("newAccount")}</button>
      </div>

      <table className="simple-table">
        <thead>
          <tr>
            <th>#</th>
            <th>{t("accountHolder")}</th>
            <th>{t("bank")}</th>
            <th>{t("accountType")}</th>
            <th>{t("currency")}</th>
            <th>{t("accountNumber")}</th>
            <th>IBAN</th>
            <th>SWIFT</th>
            <th>Sort Code</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id} onClick={() => openEdit(a)}>
              <td>{a.id}</td>
              <td>{a.holder_name}</td>
              <td>{a.bank_name}</td>
              <td>{a.account_type_name}</td>
              <td>{a.currency_code}</td>
              <td>{a.account_number}</td>
              <td>{a.iban}</td>
              <td>{a.swift_code}</td>
              <td>{a.sort_code}</td>
              <td>
                <button
                  className="danger small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(a.id);
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
        <Modal title={editing ? t("editAccount") : t("newAccount")} onClose={() => setShowModal(false)}>
          <form className="entity-form" onSubmit={handleSubmit}>
            <label>
              {t("accountHolder")}
              <select
                required
                value={form.holder_id}
                onChange={(e) => setForm({ ...form, holder_id: e.target.value })}
              >
                <option value="" disabled>
                  {t("choose")}
                </option>
                {holders.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t("bank")}
              <select required value={form.bank_id} onChange={(e) => setForm({ ...form, bank_id: e.target.value })}>
                <option value="" disabled>
                  {t("choose")}
                </option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t("accountType")}
              <select
                required
                value={form.account_type_id}
                onChange={(e) => setForm({ ...form, account_type_id: e.target.value })}
              >
                <option value="" disabled>
                  {t("choose")}
                </option>
                {types.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t("currency")}
              <select
                required
                value={form.currency_id}
                onChange={(e) => setForm({ ...form, currency_id: e.target.value })}
              >
                <option value="" disabled>
                  {t("choose")}
                </option>
                {currencies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t("accountNumber")}
              <input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
            </label>

            <label>
              IBAN
              <input value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} />
            </label>

            <label>
              SWIFT Code
              <input value={form.swift_code} onChange={(e) => setForm({ ...form, swift_code: e.target.value })} />
            </label>

            <label>
              Sort Code
              <input value={form.sort_code} onChange={(e) => setForm({ ...form, sort_code: e.target.value })} />
            </label>

            <label>
              {t("openingDate")}
              <input type="date" value={form.opening_date} onChange={(e) => setForm({ ...form, opening_date: e.target.value })} />
            </label>

            {selectedTypeName === "Credit Card" && (
              <label>
                {t("monthlyDueDay")}
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={form.due_day}
                  onChange={(e) => setForm({ ...form, due_day: e.target.value })}
                />
              </label>
            )}

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
