const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export async function getAllMovies(){
    try {
        const response = await fetch(`${apiUrl}/movies`);
        const {message, movies} = await response.json();
        console.log(message)
        return movies;    
    } 
    catch (error) {
        console.log(error);
        return null;
    }
}