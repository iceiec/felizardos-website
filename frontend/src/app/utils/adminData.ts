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
  id: number;
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
  notes?: string;
}

export interface MaintenanceItem {
  id: number;
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

const fmt = (d: Date) => d.toISOString().split("T")[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};
const today = new Date();

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: "pavilion",
    name: "The Pavilion",
    type: "Event Hall",
    capacity: 200,
    status: "active",
    showOnLanding: true,
    description:
      "An open-air garden sanctuary for weddings, debuts, and milestone celebrations — up to 200 guests in effortless elegance.",
    amenities: ["Garden backdrop", "Full catering kitchen", "Sound system", "Bridal suite", "Free parking", "Backup generator"],
    rentalPrice: 25000,
  },
  {
    id: "pool",
    name: "Swimming Pool",
    type: "Recreation",
    capacity: 150,
    status: "active",
    showOnLanding: true,
    description:
      "A resort-style tropical paradise for pool parties, family celebrations, team events, and sunset gatherings.",
    amenities: ["Crystal-clear pool", "Lounge deck", "Lifeguard on duty", "Poolside bar", "Underwater LED lighting", "Changing rooms"],
    rentalPrice: 15000,
  },
  {
    id: "andoy",
    name: "Andoy Court",
    type: "Basketball Court",
    capacity: 50,
    status: "active",
    showOnLanding: false,
    description:
      "Full-size outdoor basketball court with quality flooring and night lighting — ideal for tournaments, league games, and private games.",
    amenities: ["Full-size court", "Night lighting", "Bleacher seating", "Ball rental available", "Scoreboard", "Restroom access"],
    rentalPrice: 5000,
  },
  {
    id: "juliet",
    name: "Juliet Court",
    type: "Basketball Court",
    capacity: 50,
    status: "maintenance",
    showOnLanding: false,
    description:
      "Full-size outdoor basketball court with premium flooring, currently undergoing floor refinishing. Expected back online August 2025.",
    amenities: ["Full-size court", "Night lighting", "Bleacher seating", "Ball rental available", "Scoreboard", "Restroom access"],
    rentalPrice: 5000,
  },
];

export const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: 1,
    facilityId: "pavilion",
    title: "Santos Wedding Reception",
    clientName: "Jose & Maria Santos",
    date: fmt(addDays(today, 3)),
    startTime: "15:00",
    endTime: "22:00",
    status: "confirmed",
    guests: 180,
    packageName: "Premium",
    phone: "+63 912 111 2222",
    notes: "White & gold theme. Requires bridal suite from 1:00 PM.",
  },
  {
    id: 2,
    facilityId: "pool",
    title: "Cruz Family Pool Party",
    clientName: "Ricardo Cruz",
    date: fmt(addDays(today, 1)),
    startTime: "10:00",
    endTime: "18:00",
    status: "confirmed",
    guests: 60,
    packageName: "Wave",
    phone: "+63 917 222 3333",
    notes: "Birthday party for 7-year-old. Floating decorations needed.",
  },
  {
    id: 3,
    facilityId: "pavilion",
    title: "Reyes 18th Debut",
    clientName: "Ana Reyes",
    date: fmt(addDays(today, 8)),
    startTime: "16:00",
    endTime: "23:00",
    status: "confirmed",
    guests: 150,
    packageName: "Full Day",
    phone: "+63 918 333 4444",
    notes: "Lilac and white motif. 18 roses ceremony at 7:30 PM.",
  },
  {
    id: 4,
    facilityId: "andoy",
    clientName: "Brgy. San Isidro",
    date: fmt(addDays(today, 5)),
    startTime: "08:00",
    endTime: "17:00",
    status: "confirmed",
    phone: "+63 920 444 5555",
  },
  {
    id: 5,
    facilityId: "pool",
    title: "Dela Torre Corporate Team Building",
    clientName: "Dela Torre Corp",
    date: fmt(addDays(today, 12)),
    startTime: "09:00",
    endTime: "17:00",
    status: "pending",
    guests: 90,
    packageName: "Tide",
    phone: "+63 915 555 6666",
    notes: "Awaiting signed contract. Catering handled by client.",
  },
  {
    id: 6,
    facilityId: "pavilion",
    title: "Bautista 50th Anniversary",
    clientName: "Ernesto Bautista",
    date: fmt(addDays(today, -5)),
    startTime: "18:00",
    endTime: "23:00",
    status: "completed",
    guests: 120,
    packageName: "Full Day",
    phone: "+63 916 666 7777",
    notes: "Completed successfully. Full deposit received.",
  },
  {
    id: 7,
    facilityId: "andoy",
    clientName: "Alumni Association",
    date: fmt(addDays(today, 20)),
    startTime: "14:00",
    endTime: "20:00",
    status: "pending",
    phone: "+63 921 777 8888",
  },
];

export const INITIAL_MAINTENANCE: MaintenanceItem[] = [
  {
    id: 1,
    facilityId: "pool",
    title: "Monthly Pool Filter Cleaning",
    description: "Full backwash and chemical balance check for main filtration system.",
    priority: "high",
    status: "in-progress",
    scheduledDate: fmt(addDays(today, 1)),
    assignee: "Maintenance Team A",
  },
  {
    id: 2,
    facilityId: "juliet",
    title: "Court Floor Refinishing",
    description: "Sanding and recoating of hardwood floor. Estimated 5 days. Venue closed during works.",
    priority: "medium",
    status: "in-progress",
    scheduledDate: fmt(today),
    assignee: "Flooring Contractor — Reyes Works",
  },
  {
    id: 3,
    facilityId: "pavilion",
    title: "AC System Annual Check",
    description: "Comprehensive inspection and cleaning of all air conditioning units in the Pavilion.",
    priority: "low",
    status: "completed",
    scheduledDate: fmt(addDays(today, -7)),
    assignee: "Maintenance Team B",
  },
  {
    id: 4,
    facilityId: "andoy",
    title: "Court Night Lighting Repair",
    description: "Two flood light bulbs burnt out. Replacement and rewiring needed for poles 3 & 4.",
    priority: "high",
    status: "scheduled",
    scheduledDate: fmt(addDays(today, 4)),
    assignee: "Electrician — J. Magsino",
  },
  {
    id: 5,
    facilityId: "pavilion",
    title: "Sound System Calibration",
    description: "Re-calibrate and update firmware on main PA system before upcoming wedding season.",
    priority: "medium",
    status: "scheduled",
    scheduledDate: fmt(addDays(today, 6)),
    assignee: "Audio Technician — Sound Pro",
  },
  {
    id: 6,
    facilityId: "pool",
    title: "Poolside Lounge Chair Replacement",
    description: "Replace 8 sun loungers showing structural wear. New chairs already ordered.",
    priority: "low",
    status: "scheduled",
    scheduledDate: fmt(addDays(today, 10)),
    assignee: "Maintenance Team A",
  },
];

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
