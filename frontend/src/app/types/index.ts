// Shared TypeScript types — mirrors server-side Mongoose schemas.
// Admin pages currently import these from ../utils/adminData (re-exported there).
// Service files import directly from here.

export type FacilityStatus = "active" | "maintenance" | "inactive";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type MaintenancePriority = "low" | "medium" | "high" | "critical";
export type MaintenanceStatus = "scheduled" | "in-progress" | "completed";

export interface Facility {
  _id?: string;
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: FacilityStatus;
  description: string;
  showOnLanding: boolean;
  amenities: string[];
  rentalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Schedule {
  _id?: string;
  id: string;
  facilityId: string;
  title?: string;        // not used for basketball courts
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  guests?: number;       // not used for basketball courts
  packageName?: string;  // not used for basketball courts
  phone: string;
  notes?: string;        // not used for basketball courts
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceItem {
  _id?: string;
  id: string;
  facilityId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  assignee: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VenuePackage {
  name: string;
  hours: string;
  price: string;
  features: string[];
  highlight: boolean;
}

export interface SiteContent {
  heroTagline: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactHours: string;
  pavilionImage: string;
  pavilionDescription: string;
  pavilionIntro: string;
  pavilionAmenities: string[];
  pavilionPackages: VenuePackage[];
  pavilionGallery: string[];
  poolImage: string;
  poolDescription: string;
  poolIntro: string;
  poolAmenities: string[];
  poolPackages: VenuePackage[];
  poolGallery: string[];
}

export interface AdminSettings {
  venueName: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  notifyNewBooking: boolean;
  notifyMaintenance: boolean;
  notifyPayment: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthPayload {
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
  };
}
