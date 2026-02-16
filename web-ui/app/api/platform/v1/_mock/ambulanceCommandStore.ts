export type AmbulanceType = "BLS" | "ALS" | "ICU";
export type AmbulanceStatus = "AVAILABLE" | "DISPATCHED" | "MAINTENANCE";
export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";
export type EmergencyPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type EmergencyStatus =
  | "RECEIVED"
  | "DISPATCHED"
  | "EN_ROUTE"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELLED";

export const ambulanceFleetStore: Array<{
  id: string;
  tenantId: string;
  vehicleNumber: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  currentDriverId?: string;
}> = [
  { id: "amb-t1-1", tenantId: "tenant-a", vehicleNumber: "TN-A-1001", type: "BLS", status: "AVAILABLE" },
  { id: "amb-t1-2", tenantId: "tenant-a", vehicleNumber: "TN-A-1002", type: "ALS", status: "AVAILABLE" },
  { id: "amb-t1-3", tenantId: "tenant-a", vehicleNumber: "TN-A-1003", type: "ICU", status: "MAINTENANCE" },
  { id: "amb-t2-1", tenantId: "tenant-b", vehicleNumber: "TN-B-2001", type: "BLS", status: "AVAILABLE" },
  { id: "amb-t2-2", tenantId: "tenant-b", vehicleNumber: "TN-B-2002", type: "ALS", status: "AVAILABLE" },
  { id: "amb-t2-3", tenantId: "tenant-b", vehicleNumber: "TN-B-2003", type: "ICU", status: "AVAILABLE" },
];

export const driverStore: Array<{
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  status: DriverStatus;
}> = [
  { id: "drv-t1-1", tenantId: "tenant-a", name: "Asha Nair", phone: "+91-900001001", status: "AVAILABLE" },
  { id: "drv-t1-2", tenantId: "tenant-a", name: "Ravi Kumar", phone: "+91-900001002", status: "AVAILABLE" },
  { id: "drv-t1-3", tenantId: "tenant-a", name: "John Paul", phone: "+91-900001003", status: "OFF_DUTY" },
  { id: "drv-t2-1", tenantId: "tenant-b", name: "Fatima Ali", phone: "+91-900002001", status: "AVAILABLE" },
  { id: "drv-t2-2", tenantId: "tenant-b", name: "Karan Mehta", phone: "+91-900002002", status: "AVAILABLE" },
  { id: "drv-t2-3", tenantId: "tenant-b", name: "Mohan Das", phone: "+91-900002003", status: "AVAILABLE" },
];

export const emergencyCallStore: Array<{
  id: string;
  tenantId: string;
  callerName: string;
  phone: string;
  pickupLocation: string;
  conditionSummary: string;
  priority: EmergencyPriority;
  status: EmergencyStatus;
  assignedAmbulanceId?: string;
  assignedDriverId?: string;
  externalProviderTenantId?: string;
  patientId?: string;
  timeline: Array<{ ts: string; action: string; note?: string }>;
}> = [];

export const ambulanceTripStore: Array<{
  id: string;
  tenantId: string;
  emergencyCallId: string;
  ambulanceId: string;
  driverId: string;
  startTime?: string;
  arrivalTime?: string;
  hospitalArrivalTime?: string;
  vitalsDuringTransit: Array<{
    ts: string;
    pulse?: number;
    bp?: string;
    spo2?: number;
    note?: string;
  }>;
}> = [];

export const patientPreAdmissionStore: Array<{
  id: string;
  tenantId: string;
  name: string;
  source: "AMBULANCE";
  createdAt: string;
}> = [];

export const preAdmissionStore: Array<{
  id: string;
  tenantId: string;
  patientId: string;
  emergencyCallId: string;
  createdAt: string;
  status: "PENDING_ER";
}> = [];

export const notificationStore: Array<{
  id: string;
  tenantId: string;
  channel: "DRIVER" | "HOSPITAL_ADMIN" | "ER_DESK" | "DOCTOR";
  message: string;
  createdAt: string;
}> = [];
