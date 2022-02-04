import { useState, useEffect } from "react";

const UseFetch = (initialUrl) => {
  // create state variables
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [url, setUrl] = useState({ type: "json", source: initialUrl });
  //console.log(initialUrl);

  useEffect(() => {
    if (!url.source) return;
    setIsLoading(true);
    // clear old search
    setData(null);
    setError(null);

    fetch(url.source)
      .then((response) => {
        //console.log(response);
        if (response.status != 200) {
          setError(response.statusText);
        } else {
          if (url.type === "json") {
            return response.json();
          } else {
            return response.blob();
          }
        }
      })

      .then((data) => {
        //console.log("FETCH ", data);
        setIsLoading(false);
        setData(data);
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error);
      });
  }, [url]);

  return { data, error, isLoading, setUrl };
};

export default UseFetch;
