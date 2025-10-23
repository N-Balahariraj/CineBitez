const isAdmin = require('../middlewares/isAdmin')
const movieController = require('../controllers/movie.controller')

module.exports = (app) =>{
    app.get('/api/movies',movieController.fetchAllMovies)
    app.post('/api/new-movie',isAdmin.isAdmin, movieController.addNewMovie)
    app.post('/api/new-movies', isAdmin.isAdmin, movieController.addNewMovies)
    app.put('/api/edit-movie/:name', isAdmin.isAdmin, movieController.editMovie)
    app.delete('/api/remove-movie/:name', isAdmin.isAdmin, movieController.removeMovie)
    app.delete('/api/flush-movies', isAdmin.isAdmin, movieController.removeAllMovies)
}