const isNewUser = require('../middlewares/isNewUser');
const userController = require('../controllers/user.controller');

module.exports = (app) => {
    app.post('/api/authenticate',isNewUser.isNewUser,userController.authenticate)
}