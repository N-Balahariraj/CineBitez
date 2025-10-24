const {
  fetchAllTheatres,
  addNewTheatre,
  editTheatre,
  removeTheatre,
  editShows,
} = require("../controllers/theatre.controller");

const { authorize } = require("../middlewares/authorize");

module.exports = (app) => {
  app.get("/api/theatres", fetchAllTheatres);
  app.post("/api/new-theatre", authorize, addNewTheatre);
  app.put("/api/edit-theatre/:name", authorize, editTheatre);
  app.delete("/api/remove-theatre/:name", authorize, removeTheatre);
  app.put("/api/shows/:name", authorize, editShows);
};
