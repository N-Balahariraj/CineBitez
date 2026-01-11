const movie = require("../models/movies.model")

module.exports.fetchAllMovies = async function(req,res){
    try {
        const movies = await movie.find({});
        res.status(200).send({message:"data retrived", movies})
        
    } catch (error) {
        console.log(error)
        res.status(error.code).send({message:error.message})
    }
}

module.exports.addNewMovie = async function(req, res){
    try {
        if (Array.isArray(req.body) && req.body.length === 0) {
            return res.status(400).send({ message: "Request body must be a non-empty array of movies." });
        }
        let newMovies;
        if(Array.isArray(req.body)){
            newMovies = await movie.insertMany(req.body);
            return res.status(201).send({ message: `${newMovies.length} movies created`, movies: newMovies });
        }
        newMovies = await movie.create(req.body);
        return res.status(201).send({ message: "movie created", movie: newMovies });

    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(409).send({ message: "A movie with this ID already exists." });
        }
        res.status(500).send({ message: "An internal server error occurred." });
    }
}

module.exports.editMovie = async function(req, res) {
    try {
        const movieName = req.params.name;
        const updatedMovie = await movie.findOneAndUpdate({ movie: movieName }, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedMovie) {
            return res.status(404).send({ message: `Movie with name '${movieName}' not found.` });
        }

        res.status(200).send({ message: "Movie updated successfully.", movie: updatedMovie });
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            return res.status(409).send({ message: "Cannot update movie name or ID to one that already exists." });
        }
        res.status(500).send({ message: "An internal server error occurred." });
    }
}

module.exports.removeMovie = async function(req, res) {
    try {
        const movieName = req.params.name;
        const deletedMovie = await movie.findOneAndDelete({ movie: movieName });

        if (!deletedMovie) {
            return res.status(404).send({ message: `Movie with name '${movieName}' not found.` });
        }

        res.status(200).send({ message: "Movie deleted successfully.", movie: deletedMovie });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "An internal server error occurred." });
    }
}

module.exports.removeAllMovies = async function(req, res) {
    try {
        const deletionInfo = await movie.deleteMany({});
        res.status(200).send({ message: `All movies deleted successfully. Count: ${deletionInfo.deletedCount}` });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "An internal server error occurred while deleting all movies." });
    }
}