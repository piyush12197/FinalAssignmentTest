import { internalLabWorklistStore, internalPharmacyWorklistStore, prescriptionStore } from "../_mock/prescriptionStore";
import { routeOrderToPartner } from "../_mock/partnerStore";
import { byScope, getRequestScope, notify, ok } from "../emergency/_lib/utils";

export async function POST(req: Request) {
  const tenantId = getRequestScope(req);
  const body = await req.json();

  const prescription = {
    id: `rx-${Date.now()}`,
    tenantId,
    patientName: body.patientName ?? "Unknown",
    labTests: Array.isArray(body.labTests) ? body.labTests : [],
    medicines: Array.isArray(body.medicines) ? body.medicines : [],
    createdAt: new Date().toISOString(),
  };
  prescriptionStore.push(prescription);

  const routedExternally: string[] = [];
  if (prescription.labTests.length > 0) {
    const routed = routeOrderToPartner(tenantId, "LAB", prescription.id);
    if (routed) {
      routedExternally.push("LAB");
      notify(routed.partner.tenantId, "HOSPITAL_ADMIN", `New external LAB order ${routed.order.id} from ${tenantId}.`);
    } else {
      internalLabWorklistStore.push({ id: `labw-${Date.now()}`, tenantId, prescriptionId: prescription.id, createdAt: new Date().toISOString() });
    }
  }

  if (prescription.medicines.length > 0) {
    const routed = routeOrderToPartner(tenantId, "PHARMACY", prescription.id);
    if (routed) {
      routedExternally.push("PHARMACY");
      notify(routed.partner.tenantId, "HOSPITAL_ADMIN", `New external PHARMACY order ${routed.order.id} from ${tenantId}.`);
    } else {
      internalPharmacyWorklistStore.push({
        id: `pharmw-${Date.now()}`,
        tenantId,
        prescriptionId: prescription.id,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return ok({ prescription, routedExternally }, "Prescription created");
}

export async function GET(req: Request) {
  const tenantId = getRequestScope(req);
  return ok(byScope(prescriptionStore, tenantId));
}
