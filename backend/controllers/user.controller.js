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
    try {
      const account = await user.findOneAndUpdate({username}, req.body, {
        new: true,
        runValidators: true,
      });
      res.send({ message: "Updated user successfully", account });
    } 
    catch (error) {
      console.error(error);
      if (error.code === 11000) {
        return res
          .status(409)
          .send({ message: "An user with this username/email already exists." });
      }
      res.status(500).send({ message: "Error editing user", error });
    }
  },

  async removeAccount(req, res) {
    const username = req.params.name;
    try {
      const account = await user.findOneAndDelete(username);
      res.status(200).send({
        message: `${account.username}'s account deleted successfully`,
      });
    } 
    catch (error) {
      res.status(500).send({ message: "Error deleting Account", error });
    }
  },
};
