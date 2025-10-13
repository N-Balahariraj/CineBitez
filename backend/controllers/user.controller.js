const bcrypt = require("bcrypt");
const user = require("../models/users.model");

module.exports.authenticate = async function (req, res) {
    if (req.user) {
        const isMatch = await req.user.comparePassword(req.body.password);
        if (isMatch) {
            res
                .status(200)
                .send({ message: "user logged in successfully", user: req.user });
        } else {
            res
                .status(401)
                .send({ message: "Invalid password" });
        }
    } else {
        try {
            const newUser = await user.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password, // No need to hash here, model will handle it
            });
            res
                .status(201)
                .send({ message: "User created successfully", user: newUser });
        } catch (createError) {
            res
                .status(500)
                .send({ message: "Error creating user", error: createError });
        }
    }
};
