import React,{useState,useEffect} from "react";

export default function FakeAPICon() {
  var XXCon = {
    url: "https://api-gate2.movieglu.com/filmsNowShowing/?n=10",
    method: "GET",
    timeout: 0,
    headers: {
      "api-version": "v200",
      Authorization: "Basic U0VDRV9YWDpSeTVyc3Y3ZTVxTlQ=",
      client: "SECE",
      "x-api-key": "IW6h5qWWjO3H5iPI3oHsE7zIBvkY5sAC7AGhhwdZ",
      "device-datetime": "2023-12-30T16:17:55.935Z",
      territory: "XX",
    },
  };

  var INCon = {
    url: "https://api-gate2.movieglu.com/filmsNowShowing/?n=10",
    method: "GET",
    timeout: 0,
    headers: {
      "api-version": "v200",
      Authorization: "Basic U0VDRTp2TWZjekFJb1c4SGo=",
      client: "SECE",
      "x-api-key": "R7WqzCmN0W5Hfz6XoWXXY1dWlZYXEMFz1YvrARrQ",
      "device-datetime": "2023-12-30T16:17:55.935Z",
      territory: "IN",
    },
  };

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        XXCon
      );

      if (response.ok) {
        const data = await response.json();

        setData(data);

        setError(null);
      } else {
        throw new Error(`Something went wrong: ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("Data : \n",data);

  return <div>FakeAPICon</div>;
}
