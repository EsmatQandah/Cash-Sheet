import React from "react";
import { useLanguage } from "../state/LanguageContext";

interface AlertCardProps {
  title: string;
  subtitle: string;
  days: number;
}

export default function AlertCard({ title, subtitle, days }: AlertCardProps) {
  const { t } = useLanguage();
  let severity = "ok";
  if (days < 0) severity = "overdue";
  else if (days <= 7) severity = "urgent";
  else if (days <= 30) severity = "soon";

  const label = days < 0 ? t("daysOverdue", { n: Math.abs(days) }) : days === 0 ? t("dueToday") : t("daysRemaining", { n: days });

  return (
    <div className={`alert-card alert-${severity}`}>
      <div className="alert-title">{title}</div>
      <div className="alert-subtitle">{subtitle}</div>
      <div className="alert-days">{label}</div>
    </div>
  );
}
