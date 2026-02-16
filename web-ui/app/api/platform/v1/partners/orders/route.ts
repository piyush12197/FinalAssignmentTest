import { ok } from "../../emergency/_lib/utils";
import { getVisibleOrders } from "../_lib";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  let orders = getVisibleOrders(req);
  if (type) orders = orders.filter((order) => order.type === type);
  if (status) orders = orders.filter((order) => order.status === status);

  return ok(orders, "Partner orders fetched");
}
