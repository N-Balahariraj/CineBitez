const apiUrl = 'http://localhost:5000/api';

export async function API(path, method = "GET", data) {
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