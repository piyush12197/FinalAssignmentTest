"use client";

import { useState } from "react";
import { demoUsers } from "../api/platform/v1/_mock/userStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function onLogin(e: React.FormEvent) {
    e.preventDefault();
    const user = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      setMessage("Invalid credentials.");
      return;
    }

    if (user.status !== "ACTIVE") {
      setMessage("Your account is not activated.");
      return;
    }

    setMessage("Login successful.");
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Login</h1>
      <form onSubmit={onLogin} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
