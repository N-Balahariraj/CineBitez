const {
  fetchAllShowSessions,
  fetchShowSession,
  addNewShowSession,
  editShowSession,
  removeShowSession,
  removeAllShowSessions,
} = require("../controllers/showSession.controller");

const { authorize } = require("../middlewares/authorize");

module.exports = (app) => {
  // Public (read)
  app.get("/api/showSessions", fetchAllShowSessions);
  app.get("/api/showSession/:id", fetchShowSession);

  // Protected (write)
  app.post("/api/new-showSessions", authorize, addNewShowSession);
  app.put("/api/edit-showSession/:id", authorize, editShowSession);
  app.delete("/api/remove-showSession/:id", authorize, removeShowSession);
  app.delete("/api/flush-showSessions", authorize, removeAllShowSessions);
};