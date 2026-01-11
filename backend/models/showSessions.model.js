const mongoose = require("mongoose");

const seatStateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["available", "reserved", "booked"],
      default: "available",
    },
    reservedUntil: { type: Date, default: null },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
      default: null,
    },
  },
  { _id: false }
);

const showSessionSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
      required: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "theatres",
      required: true,
    },
    hallId: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, require: true },

    // store as cents (consistent with your other models)
    price: {
      type: Number,
      required: true,
      min: 0,
      get: (v) => (v / 100).toFixed(2),
      set: (v) => Math.round(v * 100),
    },

    // Map<seatId, {status,reservedUntil,bookingId}>
    seatStatus: {
      type: Map,
      of: seatStateSchema,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

// Prevent duplicate sessions for same hall at same time
showSessionSchema.index(
  { theatreId: 1, hallId: 1, startTime: 1 },
  { unique: true }
);

module.exports = mongoose.model("showSessions", showSessionSchema);
