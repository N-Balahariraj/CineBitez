const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    showSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "showSessions", required: true },

    seats: { type: [String], required: true },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

// Helpful query index
bookingSchema.index({ userId: 1, bookingDate: -1 });

module.exports = mongoose.model("bookings", bookingSchema);