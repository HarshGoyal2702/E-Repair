const mongoose = require("mongoose");
const { Schema } = mongoose; 

const userSchema = new Schema(
  {
    name: { 
        type: String, 
        required: true, 
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        trim: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6, 
        select: false 
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

    specialty: { 
        type: String,
        trim: true,
    },
    assignedRequests: [{ 
        type: Schema.Types.ObjectId,
        ref: "RepairRequest",
    }],

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true, 
  }
);




module.exports = mongoose.model("User", userSchema);