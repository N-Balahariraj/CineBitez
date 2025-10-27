const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function getJson(path, options = {}) {
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
  getJson("new-theatre", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(theatre),
  });

export const editTheatre = async (theatre, name) =>
  getJson(`edit-theatre/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(theatre),
  });

export const removeTheatre = async (name) =>
  getJson(`remove-theatre/${name}`, {
    method: "DELETE",
  });

//Operation on shows
export const shows = async (name, showList) =>
  getJson(`shows/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(showList),
  });
