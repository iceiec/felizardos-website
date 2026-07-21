// Server-side TypeScript types — mirrors client src/app/types/index.ts.
// Mongoose documents extend these interfaces.

export type FacilityStatus = "active" | "maintenance" | "inactive";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type MaintenancePriority = "low" | "medium" | "high" | "critical";
export type MaintenanceStatus = "scheduled" | "in-progress" | "completed";

export interface IFacility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: FacilityStatus;
  description: string;
  showOnLanding: boolean;
  amenities: string[];
  rentalPrice: number;
}

export interface ISchedule {
  facilityId: string;
  title?: string;        // not used for basketball courts
  clientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  guests?: number;       // not used for basketball courts
  packageName?: string;  // not used for basketball courts
  phone: string;
  notes?: string;        // not used for basketball courts
}

export interface IMaintenanceItem {
  facilityId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: Date;
  assignee: string;
}

export interface ISiteContent {
  heroTagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactHours: string;
  pavilionDescription: string;
  poolDescription: string;
}

export interface IAdmin {
  email: string;
  password: string;
  name: string;
  role: "admin";
}

// Attached to req by authMiddleware after JWT verification
export interface AuthRequest extends Express.Request {
  admin?: { id: string; email: string };
}
