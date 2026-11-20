export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";

export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: BookingStatus;
  finalAmount: number;
  paymentStatus: "unpaid" | "paid";
  statusHistory?: { status: BookingStatus; changedAt: string }[];
  createdAt: string;
};
export type Payment = {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  technicianName: string;
  amount: number;
  transactionId: string;
  paidAt: string;
};
export type MyService = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
};


// #FM-1052 type short booking id
export const shortId = (id: string) => `#FM-${id.slice(-4).toUpperCase()}`;
export const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { timeZone: "UTC" });
