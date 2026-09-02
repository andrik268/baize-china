import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App, { PrivacyPolicyPage } from "./App.jsx";
import { AdminApp } from "./Admin.jsx";
import "./styles.css";
import "./admin.css";
import "./leads.css";

const isAdminRoute = window.location.pathname === "/admin" || window.location.pathname.startsWith("/admin/");
const isPrivacyRoute = window.location.pathname === "/privacy-policy" || window.location.pathname.startsWith("/privacy-policy/");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {isAdminRoute ? <AdminApp /> : isPrivacyRoute ? <PrivacyPolicyPage /> : <App />}
  </StrictMode>,
);
