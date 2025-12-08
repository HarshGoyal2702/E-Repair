const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "worker", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zip: { type: String, trim: true },
      country: { type: String, default: "India" },
    },

    specialty: [
      {
        type: String,
        trim: true,
      },
    ],
    assignedRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "RepairRequest",
      },
    ],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// userSchema.pre("save", function (next) {
//   const role = this.role;
//   const specialty = this.specialty;

//   if (role === "admin") {
//     this.address = undefined;
//     this.specialty = undefined;
//   }

//   if (role === "user") {
//     this.specialty = undefined;
//   }

//   if (role === "worker") {
//     if (!specialty || specialty.length === 0) {
//       return next(new Error("Worker must have at least one specialty"));
//     }
//   }

//   next();
// });

// 2. Query Middleware for 'findOneAndUpdate' (used by .updateOne(), .findByIdAndUpdate(), etc.)
// Update hook for findOneAndUpdate
// userSchema.pre("findOneAndUpdate", function () {
//   const update = this.getUpdate();

//   if (!update) return; // nothing to do

//   // If using $set operator
//   const data = update.$set || update;

//   const role = data.role;
//   const specialty = data.specialty;

//   if (role === "admin") {
//     data.address = undefined;
//     data.specialty = undefined;
//   }

//   if (role === "user") {
//     data.specialty = undefined;
//   }

//   if (role === "worker" && specialty && specialty.length === 0) {
//     throw new Error("Worker must have at least one specialty");
//   }
// });


module.exports = mongoose.model("User", userSchema);
