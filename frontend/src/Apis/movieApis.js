const apiUrl = 'http://localhost:5000/api';

async function API(path, method = "GET", data) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (data !== undefined && method !== "GET" && method !== "HEAD")
    options.body = JSON.stringify(data);

  try {
    const res = await fetch(`${apiUrl}/${path}`, options);
    const resData = await res.json();
    console.log(resData);
    return resData;
  } 
  catch (error) {
    console.log(error)
    console.log(error.message);
  }
}

export const getAllMovies = () => API("movies");
export const addNewMovie = (movie) => API("new-movie","POST",movie);
export const addNewMovies = (movieList) => API("new-movies","POST",movieList)
export const editMovie = (movie,name) => API(`edit-movie/${name}`,"PUT",movie);
export const removeMovie = (name) => API(`remove-movie/${name}`,"DELETE")