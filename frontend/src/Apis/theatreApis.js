const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function getJson(path, method, data = {}) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const res = await fetch(`${apiUrl}/${path}`, options);
    const data = await res.json();
    console.log(data);
    return data;
  } 
  catch (error) {
    console.log(error.message + error.code);
  }
}

// Operation on theatres
export const getAllTheatres = async () => getJson("theatres");

export const addNewTheatre = async (theatre) =>
  getJson("new-theatre", "POST", theatre);

export const editTheatre = async (theatre, name) =>
  getJson(`edit-theatre/${name}`, "PUT", theatre);

export const removeTheatre = async (name) =>
  getJson(`remove-theatre/${name}`, "DELETE");

//Operation on shows
export const shows = async (name, showList) =>
  getJson(`shows/${name}`, "PUT", showList);
