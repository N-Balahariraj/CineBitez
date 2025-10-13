const user = require('../models/users.model');

module.exports.isNewUser = async function(req, res, next) {
    if (req.body.isNewUser) {
        return next();
    }

    try {
        const foundUser = await user.findOne({ email: req.body.email });
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found. Please register.' });
        }
        req.user = foundUser;
        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
};