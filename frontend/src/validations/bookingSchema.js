// src/validations/bookingSchema.js
import { z } from "zod";
import { STATUS_FLOW } from "@/constants/bookingStatus";
export const bookingSchema = z.object({
  deviceType: z.string().min(1, "Device type is required").max(50),
  brand: z.string().min(1, "Brand is required").max(50),
  issue: z
    .string()
    .min(5, "Issue must be at least 5 characters")
    .max(500, "Issue cannot exceed 500 characters"),
  specialty: z.string().min(1, "Specialty is required"),
  priority: z.enum(["low", "medium", "high"]).optional(),

  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(3, "Street is required"),
  zip: z.string().min(5, "PIN is required"),
});

export const BookingStatusEnum = z.enum([
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
]);

export const UpdateBookingStatusSchema = z
  .object({
    currentStatus: BookingStatusEnum,
    nextStatus: z
      .string()
      .transform((val) => val.toLowerCase())
      .pipe(BookingStatusEnum),
  })
  .refine(
    ({ currentStatus, nextStatus }) =>
      STATUS_FLOW[currentStatus]?.includes(nextStatus),
    {
      message: "Invalid status transition",
      path: ["nextStatus"],
    }
  );
