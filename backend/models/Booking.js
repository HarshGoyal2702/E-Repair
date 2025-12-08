const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    // ─────────────────────────────────────
    // Core Relations
    // ─────────────────────────────────────
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    worker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    // ─────────────────────────────────────
    // Job Information (required fields)
    // ─────────────────────────────────────
    deviceType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    issue: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    specialty: {
      type: String,
      required: true,
      trim: true, // e.g., "AC Repair", "Plumbing"
    },

    // ─────────────────────────────────────
    // Address Snapshot (copied from user)
    // ─────────────────────────────────────
    serviceAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
      country: { type: String, default: "India" },
    },

    // ─────────────────────────────────────
    // Status & Workflow
    // ─────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "assigned", "accepted", "in_progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    scheduledAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    // ─────────────────────────────────────
    // Admin & Worker Notes
    // ─────────────────────────────────────
    adminNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    workerNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // ─────────────────────────────────────
    // Financials (optional)
    // ─────────────────────────────────────
    estimatedPrice: {
      type: Number,
      min: 0,
    },

    finalPrice: {
      type: Number,
      min: 0,
    },

    // ─────────────────────────────────────
    // Audit & System Fields
    // ─────────────────────────────────────
    createdByRoleSnapshot: {
      type: String,
      enum: ["user", "admin", "worker"],
    },

    statusHistory: [
      {
        from: String,
        to: String,
        changedBy: { type: Schema.Types.ObjectId, ref: "User" },
        role: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────
// Index Strategy (Performance)
// ─────────────────────────────────────
bookingSchema.index({ user: 1, status: 1, createdAt: -1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ specialty: 1 });
bookingSchema.index({ scheduledAt: 1 });

// ─────────────────────────────────────
// JSON Cleanup
// ─────────────────────────────────────
bookingSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
