const isNewUser = require('../middlewares/isNewUser');
const isAdmin = require('../middlewares/isAdmin');
const userController = require('../controllers/user.controller');

module.exports = (app) => {
    app.post('/api/authenticate',isNewUser.isNewUser,isAdmin.isAdmin,userController.authenticate)
}