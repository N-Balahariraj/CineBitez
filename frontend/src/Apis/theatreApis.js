const apiUrl = "http://localhost:5000/api";

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
    console.log(error);
    console.log(error.message);
  }
}

// Operation on theatres
export const getAllTheatres = () => API("theatres");
export const addNewTheatre = (theatre) => API("new-theatre", "POST", theatre);
export const editTheatre = (theatre, name) => API(`edit-theatre/${name}`, "PUT", theatre);
export const removeTheatre = (name) => API(`remove-theatre/${name}`, "DELETE");

//Operation on shows
export const shows = (showList, name) => API(`shows/${name}`, "PUT", showList);
