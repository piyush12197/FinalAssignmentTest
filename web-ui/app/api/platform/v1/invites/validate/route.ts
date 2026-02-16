import { bad, ok } from "../../emergency/_lib/utils";
import { readValidInvite } from "../../_lib/invites";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!token) return bad("token is required");

  const result = readValidInvite(token);
  if (!result.ok) return bad(result.reason, 400);

  return ok(result.invite, "Invite is valid");
}
