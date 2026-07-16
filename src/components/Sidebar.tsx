import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useLanguage } from "../state/LanguageContext";
import type { TranslationKey } from "../i18n/translations";

const links: { to: string; labelKey: TranslationKey; end?: boolean }[] = [
  { to: "/", labelKey: "navDashboard", end: true },
  { to: "/accounts", labelKey: "navAccounts" },
  { to: "/deposits", labelKey: "navDeposits" },
  { to: "/transactions", labelKey: "navTransactions" },
  { to: "/holders", labelKey: "navHolders" },
  { to: "/banks", labelKey: "navBanks" },
  { to: "/currencies", labelKey: "navCurrencies" },
  { to: "/account-types", labelKey: "navAccountTypes" },
  { to: "/users", labelKey: "navUsers" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t, toggleLanguage } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">{t("appName")}</div>
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "active" : "")}>
            {t(l.labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button type="button" className="lang-toggle" onClick={toggleLanguage}>
          {t("languageToggle")}
        </button>
        <div className="sidebar-user">{user?.username}</div>
        <button className="logout-btn" onClick={logout}>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
