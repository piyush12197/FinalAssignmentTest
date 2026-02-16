import { ok } from "../../emergency/_lib/utils";
import { getVisiblePartners } from "../_lib";

export async function GET(req: Request) {
  return ok(getVisiblePartners(req), "Partners fetched");
}
