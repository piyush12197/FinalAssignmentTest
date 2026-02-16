"use client";

import { useEffect, useState } from "react";

type Invite = {
  id: string;
  email: string;
  roles: string[];
  tenantId: string;
  status: "PENDING" | "ACTIVATED" | "EXPIRED";
  expiresAt: string;
};

export default function PlatformTenantUsersPage({ params }: { params: { tenantId: string } }) {
  const [email, setEmail] = useState("");
  const [rolesInput, setRolesInput] = useState("TENANT_ADMIN");
  const [facilityIdsInput, setFacilityIdsInput] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [message, setMessage] = useState("");

  async function loadInvites() {
    const res = await fetch("/api/platform/v1/platform/admin/invites", {
      headers: { "x-role": "PLATFORM_ADMIN" },
      cache: "no-store",
    });
    const json = await res.json();
    if (json?.success) {
      const scoped = (json.data as Invite[]).filter((invite) => invite.tenantId === params.tenantId);
      setInvites(scoped);
    }
  }

  useEffect(() => {
    loadInvites();
  }, [params.tenantId]);

  async function onInvite(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const roles = rolesInput.split(",").map((role) => role.trim()).filter(Boolean);
    const facilityIds = facilityIdsInput.split(",").map((id) => id.trim()).filter(Boolean);

    const res = await fetch("/api/platform/v1/platform/admin/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-role": "PLATFORM_ADMIN", "x-user-email": "platform.admin@demo.local" },
      body: JSON.stringify({ email, roles, tenantId: params.tenantId, facilityIds }),
    });
    const json = await res.json();
    setMessage(json.message || (json.success ? "Invite sent" : "Failed to invite"));
    if (json.success) {
      setEmail("");
      loadInvites();
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Tenant Users - {params.tenantId}</h1>
      <button type="button" style={{ marginBottom: 12 }}>Invite user</button>
      <form onSubmit={onInvite} style={{ display: "grid", gap: 8, maxWidth: 500 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Roles (comma separated)" value={rolesInput} onChange={(e) => setRolesInput(e.target.value)} required />
        <input placeholder="Facility IDs (optional, comma separated)" value={facilityIdsInput} onChange={(e) => setFacilityIdsInput(e.target.value)} />
        <button type="submit">Send invite</button>
      </form>
      {message && <p>{message}</p>}

      <h2 style={{ marginTop: 24 }}>Invites</h2>
      <table border={1} cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Roles</th>
            <th>Status</th>
            <th>Expires At</th>
          </tr>
        </thead>
        <tbody>
          {invites.map((invite) => (
            <tr key={invite.id}>
              <td>{invite.email}</td>
              <td>{invite.roles.join(", ")}</td>
              <td>{invite.status}</td>
              <td>{new Date(invite.expiresAt).toLocaleString()}</td>
            </tr>
          ))}
          {invites.length === 0 && (
            <tr>
              <td colSpan={4}>No invites yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
