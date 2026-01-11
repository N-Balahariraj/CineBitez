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
          .send({ message: "User logged in successfully", user: req.user });
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
        res
          .status(500)
          .send({ message: error.message || "Error creating user"});
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

  async notify(req, res) {
    const username = String(req.params.name || "").toLowerCase();

    try {
      const { notifications } = req.body || {};

      if (!Array.isArray(notifications)) {
        return res
          .status(400)
          .send({ message: "`notifications` must be an array" });
      }

      const account = await user.findOne({ username });
      if (!account) {
        return res.status(404).send({ message: "User not found" });
      }

      if(notifications.length === 1 && notifications[0]?.type === "feedback"){
        account.notifications = [...(account.notifications), ...notifications];
        await account.save();
      }
      else{
        account.notifications = notifications;
        await account.save();
      }
      
      return res.status(200).send({
        message: "Notifications updated",
        notifications: account.notifications,
      });
    } 
    catch (e) {
      console.log(e);
      return res
        .status(500)
        .send({ message: `Unable to notify user: ${e?.message}` });
    }
  },

  async getNotifications(req, res){
    const username = req.params.name;
    try{
      const account = await user.findOne({username});
      if(!account)
        return res.status(404).send({message: "User not found"});
      return res.status(200).send({message: "Notifications retrieved successfully",notifications: account.notifications})
    }
    catch(e){
      console.log(e);
      return res.status(500).send({message: e.message || "Unable to get the notifications"})
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
