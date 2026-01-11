const {
  fetchAllBookings,
  addNewBooking,
  cancelBooking,
} = require("../controllers/booking.controller");

module.exports = (app) => {
  app.get("/api/bookings", fetchAllBookings);
  app.post("/api/new-booking", addNewBooking);
  app.delete("/api/remove-booking/:id", cancelBooking);
};
