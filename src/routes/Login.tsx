import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";
import { useLanguage } from "../state/LanguageContext";

export default function Login() {
  const { login } = useAuth();
  const { t, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      navigate("/", { replace: true });
    } else {
      setError(t("invalidCredentials"));
    }
  }

  return (
    <div className="login-screen">
      <button type="button" className="lang-toggle lang-toggle-floating" onClick={toggleLanguage}>
        {t("languageToggle")}
      </button>
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>{t("appName")}</h1>
        <p className="login-subtitle">{t("loginTitle")}</p>

        <label>
          {t("username")}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </label>

        <label>
          {t("password")}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <div className="login-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? t("loggingIn") : t("loginButton")}
        </button>

        <p className="login-hint">{t("defaultCredsHint")}</p>
      </form>
    </div>
  );
}
