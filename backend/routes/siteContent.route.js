const { authorize } = require("../middlewares/authorize");
const {
  getSiteContentByKey,
  upsertSiteContentByKey,
} = require("../controllers/siteContent.controller");

module.exports = (app) => {
  app.get("/api/site-content/:key", getSiteContentByKey);
  app.put("/api/site-content/:key", authorize, upsertSiteContentByKey);
};
