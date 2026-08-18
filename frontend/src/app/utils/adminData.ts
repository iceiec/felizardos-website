// Shared types and initial data for admin dashboard

export type FacilityStatus = "active" | "maintenance" | "inactive";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type MaintenancePriority = "low" | "medium" | "high" | "critical";
export type MaintenanceStatus = "scheduled" | "in-progress" | "completed";

export interface Facility {
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

export interface Schedule {
  id: string;
  _id?: string;
  facilityId: string;
  title?: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  guests?: number;
  packageName?: string;
  phone: string;
  email?: string;
  notes?: string;
}

export interface MaintenanceItem {
  id: string;
  _id?: string;
  facilityId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  scheduledDate: string;
  assignee: string;
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

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  venueName: "",
  address: "",
  phone: "",
  email: "",
  hours: "",
  notifyNewBooking: false,
  notifyMaintenance: false,
  notifyPayment: false,
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTagline: "",
  heroTitle: "",
  heroHighlight: "",
  heroSubtitle: "",
  heroImage: "",
  contactAddress: "",
  contactPhone: "",
  contactEmail: "",
  contactHours: "",
  pavilionImage: "",
  pavilionDescription: "",
  pavilionIntro: "",
  pavilionAmenities: [],
  pavilionPackages: [],
  pavilionGallery: [],
  poolImage: "",
  poolDescription: "",
  poolIntro: "",
  poolAmenities: [],
  poolPackages: [],
  poolGallery: [],
};

export const FACILITY_COLORS: Record<string, string> = {
  pavilion: "#2D5016",
  pool: "#1A6080",
  andoy: "#7C3AED",
  juliet: "#B45309",
};
