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
    title?: string;
    clientName: string;
    date: Date;
    startTime: string;
    endTime: string;
    status: BookingStatus;
    guests?: number;
    packageName?: string;
    phone: string;
    email?: string;
    notes?: string;
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
export interface IVenuePackage {
    name: string;
    hours: string;
    price: string;
    features: string[];
    highlight: boolean;
}
export interface ISiteContent {
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
    pavilionPackages: IVenuePackage[];
    pavilionGallery: string[];
    poolImage: string;
    poolDescription: string;
    poolIntro: string;
    poolAmenities: string[];
    poolPackages: IVenuePackage[];
    poolGallery: string[];
}
export interface IAdminSettings {
    venueName: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    notifyNewBooking: boolean;
    notifyMaintenance: boolean;
    notifyPayment: boolean;
}
export interface IAdmin {
    email: string;
    password: string;
    name: string;
    role: "admin";
}
export interface AuthRequest extends Express.Request {
    admin?: {
        id: string;
        email: string;
    };
}
//# sourceMappingURL=index.d.ts.map