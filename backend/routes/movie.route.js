const authorize = require('../middlewares/authorize')
const movieController = require('../controllers/movie.controller')

module.exports = (app) =>{
    app.get('/api/movies',movieController.fetchAllMovies)
    app.post('/api/new-movie',authorize.authorize, movieController.addNewMovie)
    app.post('/api/new-movies', authorize.authorize, movieController.addNewMovies)
    app.put('/api/edit-movie/:name', authorize.authorize, movieController.editMovie)
    app.delete('/api/remove-movie/:name', authorize.authorize, movieController.removeMovie)
    app.delete('/api/flush-movies', authorize.authorize, movieController.removeAllMovies)
}