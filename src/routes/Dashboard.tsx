import React, { useEffect, useState } from "react";
import AlertCard from "../components/AlertCard";
import { useLanguage } from "../state/LanguageContext";
import type { CreditCardDue, Deposit } from "../types";

const LOOKAHEAD_DAYS = 30;

function daysUntilNextDueDay(dueDay: number): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const candidate = new Date(today.getFullYear(), today.getMonth(), dueDay);
  if (candidate < today) {
    candidate.setMonth(candidate.getMonth() + 1);
  }
  const diffMs = candidate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export default function Dashboard() {
  const { t } = useLanguage();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [cards, setCards] = useState<CreditCardDue[]>([]);

  useEffect(() => {
    window.api.deposits.upcoming(LOOKAHEAD_DAYS).then(setDeposits);
    window.api.creditCards.due(LOOKAHEAD_DAYS).then(setCards);
  }, []);

  const cardAlerts = cards
    .map((c) => ({ ...c, days: daysUntilNextDueDay(c.due_day) }))
    .filter((c) => c.days <= LOOKAHEAD_DAYS)
    .sort((a, b) => a.days - b.days);

  const depositAlerts = [...deposits].sort((a, b) => (a.days_remaining ?? 0) - (b.days_remaining ?? 0));

  return (
    <div className="page">
      <h1>{t("dashboardTitle")}</h1>

      <section>
        <h2>{t("depositsUpcoming")}</h2>
        {depositAlerts.length === 0 ? (
          <p className="empty-state">{t("noDepositsUpcoming")}</p>
        ) : (
          <div className="alert-grid">
            {depositAlerts.map((d) => (
              <AlertCard
                key={d.id}
                title={`${d.holder_name} - ${d.bank_name}`}
                subtitle={`${t("accountLabel")} ${d.account_number} - ${t("maturityLabel")} ${d.maturity_date}`}
                days={d.days_remaining ?? 0}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>{t("cardsUpcoming")}</h2>
        {cardAlerts.length === 0 ? (
          <p className="empty-state">{t("noCardsUpcoming")}</p>
        ) : (
          <div className="alert-grid">
            {cardAlerts.map((c) => (
              <AlertCard
                key={c.id}
                title={`${c.holder_name} - ${c.bank_name}`}
                subtitle={`${t("cardLabel")} ${c.account_number} - ${t("dueDayLabel")} ${c.due_day}`}
                days={c.days}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
