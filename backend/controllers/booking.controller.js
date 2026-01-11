const booking = require("../models/bookings.model");
const showSession = require("../models/showSessions.model");

async function markSeatsBooked({ showSessionId, seats, bookingId }) {
  const sessionDoc = await showSession.findById(showSessionId);
  if (!sessionDoc) {
    const err = new Error("Show session not found");
    err.status = 404;
    throw err;
  }

  const now = new Date();

  // Validate seat availability (basic server-side guard)
  const conflicts = [];
  for (const seatId of seats) {
    const st = sessionDoc.seatStatus.get(seatId);

    if (st?.status === "booked") {
      conflicts.push({ seatId, status: "booked" });
      continue;
    }

    if (st?.status === "reserved") {
      // If reservedUntil is in the future, treat as conflict
      if (
        st.reservedUntil &&
        new Date(st.reservedUntil).getTime() > now.getTime()
      ) {
        conflicts.push({ seatId, status: "reserved" });
      }
    }
  }

  if (conflicts.length) {
    const err = new Error("One or more seats are already booked/reserved");
    err.status = 409;
    err.conflicts = conflicts;
    throw err;
  }

  // Mark seats booked
  for (const seatId of seats) {
    sessionDoc.seatStatus.set(seatId, {
      status: "booked",
      reservedUntil: null,
      bookingId: bookingId,
    });
  }

  sessionDoc.markModified("seatStatus");

  await sessionDoc.save();
}

async function freeSeatsForBooking({ showSessionId, seats, bookingId }) {
  const sessionDoc = await showSession.findById(showSessionId);
  if (!sessionDoc) return; // session missing; nothing we can update

  for (const seatId of seats) {
    const st = sessionDoc.seatStatus.get(seatId);
    // Only free seats that belong to THIS booking
    if (st?.bookingId && String(st.bookingId) === String(bookingId)) {
      sessionDoc.seatStatus.set(seatId, {
        status: "available",
        reservedUntil: null,
        bookingId: null,
      });
    }
  }
  sessionDoc.markModified("seatStatus");
  await sessionDoc.save();
}

module.exports = {
  async fetchAllBookings(req, res) {
    try {
      const { userId, showSessionId, paymentStatus, from, to } = req.query;

      const filter = {};

      if (userId) filter.userId = userId;
      if (showSessionId) filter.showSessionId = showSessionId;
      if (paymentStatus) filter.paymentStatus = paymentStatus;

      if (from || to) {
        filter.bookingDate = {};
        if (from) filter.bookingDate.$gte = new Date(from);
        if (to) filter.bookingDate.$lte = new Date(to);
      }

      const bookings = await booking.find(filter).sort({ bookingDate: -1 });
      res.status(200).send({ message: "Bookings retrieved", bookings });
    } catch (error) {
      console.log(error);
      res.status(500).send("Unable to fetch bookings.");
    }
  },

  async addNewBooking(req, res) {
    try {
      const { showSessionId, seats } = req.body || {};

      if (!showSessionId) {
        return res.status(400).send({ message: "showSessionId is required" });
      }
      if (!Array.isArray(seats) || seats.length === 0) {
        return res.status(400).send({ message: "seats[] is required" });
      }

      // 1) Create booking first (so we have bookingId)
      const newBooking = await booking.create(req.body);

      // 2) Update showSession seatStatus to booked + bookingId
      try {
        await markSeatsBooked({
          showSessionId: newBooking.showSessionId,
          seats: newBooking.seats,
          bookingId: newBooking._id,
        });
      } catch (err) {
        // Rollback booking if seat update fails (best-effort)
        await booking.findByIdAndDelete(newBooking._id);

        const status = err.status || 500;
        return res.status(status).send({
          message: err.message || "Failed to update seat status",
          conflicts: err.conflicts || undefined,
        });
      }

      return res.status(201).send({ message: "Booking created", newBooking });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An internal server error occurred.", error });
    }
  },

  async cancelBooking(req, res) {
    const { id } = req.params;
    if (!id) return res.status(400).send({ message: "Booking id is required" });

    try {
      const existing = await booking.findById(id);
      if (!existing) {
        return res.status(404).send({ message: "Booking not found" });
      }

      // 1) Free seats in showSessions (only if bookingId matches)
      await freeSeatsForBooking({
        showSessionId: existing.showSessionId,
        seats: existing.seats || [],
        bookingId: existing._id,
      });

      // 2) Then delete booking
      const deleted = await booking.findByIdAndDelete(id);

      res.status(200).send({ message: "Booking removed", deleted });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};
