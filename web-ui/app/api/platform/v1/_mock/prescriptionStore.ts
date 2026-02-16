export const prescriptionStore: Array<{
  id: string;
  tenantId: string;
  patientName: string;
  labTests: string[];
  medicines: string[];
  createdAt: string;
}> = [
  {
    id: "rx-seed-1",
    tenantId: "tenant-a",
    patientName: "Isha Menon",
    labTests: ["CBC", "Thyroid Panel"],
    medicines: ["Amoxicillin 500mg"],
    createdAt: new Date().toISOString(),
  },
];

export const internalLabWorklistStore: Array<{ id: string; tenantId: string; prescriptionId: string; createdAt: string }> = [];
export const internalPharmacyWorklistStore: Array<{ id: string; tenantId: string; prescriptionId: string; createdAt: string }> = [];
