const theatre = require("../models/theatres.model");

module.exports = {
  async fetchAllTheatres(req, res) {
    try {
      const theatres = await theatre.find();
      res.status(200).send({ message: "Theatres retrieved", theatres });
    } catch (error) {
      console.log(error);
      res.status(500).send("Unable to fetch theatres.");
    }
  },

  async addNewTheatre(req, res) {
    try {
      if (Array.isArray(req.body) && req.body.length === 0) {
        return res
          .status(400)
          .send({
            message: "Request body must be a non-empty array of theatres.",
          });
      }

      let created;
      if (Array.isArray(req.body)) {
        created = await theatre.insertMany(req.body);
        return res
          .status(201)
          .send({
            message: `${created.length} theatres created`,
            theatres: created,
          });
      }

      created = await theatre.create(req.body);
      return res
        .status(201)
        .send({ message: "Theatre created", theatre: created });
    } 
    catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res
          .status(409)
          .send({ message: "A theatre with this name already exists." });
      }
      res.status(500).send({ message: "An internal server error occurred." });
    }
  },

  async editTheatre(req, res) {
    const { name } = req.params;
    if (!name)
      return res.status(400).send({ message: "Theatre name is required" });

    try {
      const updatedTheatre = await theatre.findOneAndUpdate(
        { name },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedTheatre) {
        return res.status(404).send({ message: "Theatre not found" });
      }

      res.status(200).send({ message: "Theatre updated", updatedTheatre });
    } catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res
          .status(409)
          .send({ message: "A theatre with this name already exists." });
      }
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async removeTheatre(req, res) {
    const { name } = req.params;
    if (!name)
      return res.status(400).send({ message: "Theatre name is required" });

    try {
      const deleted = await theatre.findOneAndDelete({ name });

      if (!deleted) {
        return res.status(404).send({ message: "Theatre not found" });
      }

      res.status(200).send({ message: "Theatre removed", deleted });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async removeAllTheatres(req, res) {
    try {
      const deletedTheatres = await theatre.deleteMany({});

      res.status(200).send({ message: `All Theatres removed` });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async editShows(req, res) {
    const { name } = req.params;
    if (!name)
      return res.status(400).send({ message: "Theatre name is required" });

    const shows = req.body;
    if (!Array.isArray(shows)) {
      return res
        .status(400)
        .send({ message: "Request body must include a 'shows' array" });
    }

    try {
      const updated = await theatre.findOneAndUpdate(
        { name },
        { shows },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).send({ message: "Theatre not found" });
      }

      res.status(200).send({ message: "Shows updated", shows: updated.shows });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};
