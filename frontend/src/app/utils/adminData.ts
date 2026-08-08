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

export interface SiteContent {
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
  venueName: "Felizardo's Event Place",
  address: "Felizardo's Event Place, Batangas, Philippines",
  phone: "+63 912 345 6789",
  email: "events@felizardos.com",
  hours: "Monday – Saturday, 9:00 AM – 6:00 PM",
  notifyNewBooking: true,
  notifyMaintenance: true,
  notifyPayment: false,
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTagline: "Premium Event Venue · Philippines",
  heroTitle: "Where Every Moment Becomes",
  heroHighlight: "A Memory",
  heroSubtitle:
    "Two stunning venues — an elegant Pavilion and a resort-style Swimming Pool — crafted for celebrations that deserve to be remembered.",
  contactAddress: "Felizardo's Event Place, Batangas, Philippines",
  contactPhone: "+63 912 345 6789",
  contactEmail: "events@felizardos.com",
  contactHours: "Monday – Saturday, 9:00 AM – 6:00 PM",
  pavilionDescription:
    "An open-air masterpiece embraced by lush greenery and golden natural light. The Pavilion transforms any occasion into an elegant affair — from intimate garden weddings to grand corporate galas — accommodating up to 200 guests in effortless style.",
  poolDescription:
    "Dive into a tropical paradise. Our resort-style swimming pool turns any gathering into a sun-soaked celebration — perfect for pool parties, children's birthdays, team-building retreats, and intimate sundowner events.",
};

export const FACILITY_COLORS: Record<string, string> = {
  pavilion: "#2D5016",
  pool: "#1A6080",
  andoy: "#7C3AED",
  juliet: "#B45309",
};
