const { isNewUser } = require("../middlewares/isNewUser");
const {
  authenticate,
  editAccount,
  removeAccount,
  notify,
  getNotifications
} = require("../controllers/user.controller");

module.exports = (app) => {
  app.get("/api/notifications/:name",getNotifications);
  app.post("/api/authenticate", isNewUser, authenticate);
  app.put("/api/edit-account/:name", editAccount);
  app.put("/api/notify/:name", notify);
  app.delete("/api/remove-account/:name", removeAccount);
};
