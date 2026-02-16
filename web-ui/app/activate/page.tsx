"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ValidationState = "loading" | "valid" | "invalid";

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [state, setState] = useState<ValidationState>("loading");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function validate() {
      if (!token) {
        setState("invalid");
        setMessage("Missing activation token");
        return;
      }
      const res = await fetch(`/api/platform/v1/invites/validate?token=${encodeURIComponent(token)}`, { cache: "no-store" });
      const json = await res.json();
      setState(json.success ? "valid" : "invalid");
      setMessage(json.message || (json.success ? "Invite valid" : "Invalid invite"));
    }
    validate();
  }, [token]);

  async function activate(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    const res = await fetch("/api/platform/v1/invites/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, password }),
    });
    const json = await res.json();
    setMessage(json.message || (json.success ? "Activated" : "Activation failed"));

    if (json.success) {
      setTimeout(() => router.push("/login"), 600);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h1>Account Activation</h1>
      {state === "loading" && <p>Validating invite...</p>}
      {message && <p>{message}</p>}

      {state === "valid" && (
        <form onSubmit={activate} style={{ display: "grid", gap: 8 }}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input
            placeholder="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Activate account</button>
        </form>
      )}
    </div>
  );
}
