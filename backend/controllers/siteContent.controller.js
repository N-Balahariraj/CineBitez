const siteContent = require("../models/siteContents.model");

module.exports = {
  async getSiteContentByKey(req, res) {
    const key = req.params.key;

    if (!key) return res.status(400).send({ message: "Invalid key" });

    try {
      const doc = await siteContent.findOne({ key });
      if (!doc) return res.status(404).send({ message: "Content not found" });

      return res
        .status(200)
        .send({ message: "Content retrieved", content: doc });
    } 
    catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ message: e.message || "Unable to fetch content" });
    }
  },

  async upsertSiteContentByKey(req, res) {
    const key = req.params.key;
    if (!key) return res.status(400).send({ message: "Invalid key" });

    const { content, format } = req.body || {};

    if (typeof content !== "string") {
      return res.status(400).send({ message: "`content` must be a string" });
    }

    if (format !== undefined && format !== "markdown" && format !== "text") {
      return res
        .status(400)
        .send({ message: "`format` must be 'markdown' or 'text'" });
    }

    try {
      const updated = await siteContent.findOneAndUpdate(
        { key },
        { key, content, ...(format ? { format } : {}) },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

      return res
        .status(200)
        .send({ message: "Content saved", content: updated });
    } 
    catch (e) {
      console.log(e);
      if (e.code === 11000) {
        return res
          .status(409)
          .send({ message: "A content entry with this key already exists." });
      }
      return res
        .status(500)
        .send({ message: e.message || "Unable to save content" });
    }
  },
};
