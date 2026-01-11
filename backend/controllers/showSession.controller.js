const mongoose = require("mongoose");
const showSession = require("../models/showSessions.model");

module.exports = {
  async fetchAllShowSessions(req, res) {
    try {
      const { theatreId, movieId, hallId, from, to } = req?.query;

      const filter = {};

      if (theatreId) filter.theatreId = theatreId;
      if (movieId) filter.movieId = movieId;
      if (hallId) filter.hallId = hallId;

      if (from || to) {
        filter.startTime = {};
        if (from) filter.startTime.$gte = new Date(from);
        if (to) filter.startTime.$lte = new Date(to);
      }

      const showSessions = await showSession
        .find(filter)
        .sort({ startTime: 1 });
      res
        .status(200)
        .send({ message: "Show sessions retrieved", showSessions });
    } catch (error) {
      console.log(error);
      res.status(500).send("Unable to fetch show sessions.");
    }
  },

  async fetchShowSession(req, res) {
    const { id } = req.params;
    if (!id)
      return res.status(400).send({ message: "Show session id is required" });

    try {
      const found = await showSession.findById(id);
      if (!found)
        return res.status(404).send({ message: "Show session not found" });

      res
        .status(200)
        .send({ message: "Show session retrieved", showSession: found });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async addNewShowSession(req, res) {
    try {
      if (Array.isArray(req.body) && req.body.length === 0) {
        return res
          .status(400)
          .send({
            message: "Request body must be a non-empty array of show sessions.",
          });
      }

      let created;
      if (Array.isArray(req.body)) {
        created = await showSession.insertMany(req.body);
        return res
          .status(201)
          .send({
            message: `${created.length} show sessions created`,
            showSessions: created,
          });
      }

      created = await showSession.create(req.body);
      return res
        .status(201)
        .send({ message: "Show session created", showSession: created });
    } catch (error) {
      console.error(error);

      if (error.code === 11000) {
        return res.status(409).send({
          message:
            "A show session already exists for this theatre, hall and start time.",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Validation error",
          errors: error.errors,
        });
      }

      res.status(500).send({ message: "An internal server error occurred." });
    }
  },

  async editShowSession(req, res) {
    const { id } = req.params;
    if (!id)
      return res.status(400).send({ message: "Show session id is required" });

    try {
      const updated = await showSession.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).send({ message: "Show session not found" });
      }

      res
        .status(200)
        .send({ message: "Show session updated", updatedShowSession: updated });
    } catch (error) {
      console.error(error);

      if (error.code === 11000) {
        return res.status(409).send({
          message:
            "A show session already exists for this theatre, hall and start time.",
        });
      }

      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Validation error",
          errors: error.errors,
        });
      }

      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async removeShowSession(req, res) {
    const { id } = req.params;
    if (!id)
      return res.status(400).send({ message: "Show session id is required" });

    try {
      const deletedSession = await showSession.findByIdAndDelete(id);

      if (!deletedSession) {
        return res.status(404).send({ message: "Show session not found" });
      }

      res.status(200).send({ message: "Show session removed", deletedSession });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async removeAllShowSessions(req, res) {
    try {
      const { ids, theatreId } = req.body || {};

      // priority: ids > theatreId > delete all
      let filter = {};

      if (Array.isArray(ids) && ids.length > 0) {
        const validIds = ids
          .map((id) => String(id))
          .filter((id) => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id));

        if (validIds.length === 0) {
          return res
            .status(400)
            .send({ message: "No valid session ids provided." });
        }

        filter = { _id: { $in: validIds } };
      } 
      else if (theatreId) {
        const tid = String(theatreId);
        if (!mongoose.Types.ObjectId.isValid(tid)) {
          return res.status(400).send({ message: "Invalid theatreId." });
        }
        filter = { theatreId: new mongoose.Types.ObjectId(tid) };
      } 
      else {
        filter = {}; // delete all
      }

      const result = await showSession.deleteMany(filter);

      const msg =
        Array.isArray(ids) && ids.length
          ? "Selected show sessions removed"
          : theatreId
          ? "Show sessions removed for theatre"
          : "All show sessions removed";

      res.status(200).send({ message: msg, deletedCount: result.deletedCount });
    } 
    catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  },
};
