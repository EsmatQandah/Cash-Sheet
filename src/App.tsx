import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./state/AuthContext";
import { LanguageProvider } from "./state/LanguageContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Holders from "./routes/Holders";
import Banks from "./routes/Banks";
import Currencies from "./routes/Currencies";
import AccountTypes from "./routes/AccountTypes";
import Accounts from "./routes/Accounts";
import Deposits from "./routes/Deposits";
import Transactions from "./routes/Transactions";
import UsersSettings from "./routes/UsersSettings";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="holders" element={<Holders />} />
              <Route path="banks" element={<Banks />} />
              <Route path="currencies" element={<Currencies />} />
              <Route path="account-types" element={<AccountTypes />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="deposits" element={<Deposits />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="users" element={<UsersSettings />} />
            </Route>
          </Routes>
        </HashRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
