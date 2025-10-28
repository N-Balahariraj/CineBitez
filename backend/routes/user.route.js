const { isNewUser } = require("../middlewares/isNewUser");
const {
  authenticate,
  editAccount,
  removeAccount,
} = require("../controllers/user.controller");

module.exports = (app) => {
  app.post("/api/authenticate", isNewUser, authenticate);
  app.put("/api/edit-account/:name", editAccount);
  app.delete("/api/remove-account/:name", removeAccount);
};
