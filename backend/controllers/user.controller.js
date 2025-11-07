const bcrypt = require("bcrypt");
const user = require("../models/users.model");

module.exports = {
  async authenticate(req, res) {
    if (
      req.user
    ) {
      const isMatch = await req.user.comparePassword(req.body.password);
      if (isMatch) {
        res
          .status(200)
          .send({ message: "user logged in successfully", user: req.user });
      } 
      //prettier-ignore
      else {
        res.status(401).send({ message: "Invalid password" });
      }
    }
    //prettier-ignore
    else {
      try {
        const newUser = await user.create(req.body);
        res
          .status(201)
          .send({ message: "User created successfully", user: newUser });
      } 
      catch (error) {
        console.error(error);
        if (error.code === 11000) {
          return res
            .status(409)
            .send({ message: "An user with this username/email already exists." });
        }
        res
          .status(500)
          .send({ message: "Error creating user", error});
      }
    }
  },

  async editAccount(req, res) {
    const username = req.params.name;

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ message: "No update data provided" });
    }

    try {
      const account = await user.findOneAndUpdate({ username }, req.body, {
        new: true,
        runValidators: true,
      });

      if (!account) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send({ message: "Updated user successfully", user: account });
    } 
    catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res.status(409).send({ message: "An user with this username/email already exists." });
      }
      return res.status(500).send({ message: "Error editing user", error });
    }
  },

  async removeAccount(req, res) {
    const username = req.params.name;
    try {
      const account = await user.findOneAndDelete({ username }); // pass filter object
      if (!account) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send({
        message: `${account.username}'s account deleted successfully`,
      });
    } 
    catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Error deleting Account", error });
    }
  },
};
