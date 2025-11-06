const {
  fetchAllTheatres,
  addNewTheatre,
  editTheatre,
  removeTheatre,
  editShows,
  removeAllTheatres,
} = require("../controllers/theatre.controller");

const { authorize } = require("../middlewares/authorize");

module.exports = (app) => {
  app.get("/api/theatres", fetchAllTheatres);
  app.post("/api/new-theatres", authorize, addNewTheatre);
  app.put("/api/edit-theatre/:name", authorize, editTheatre);
  app.delete("/api/remove-theatre/:name", authorize, removeTheatre);
  app.delete("/api/flush-theatres", authorize, removeAllTheatres);
  app.put("/api/shows/:name", authorize, editShows);
};
