import { useState, useEffect } from "react";

const UseFetch = initialUrl => {
  // create state variables
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [url, setUrl] = useState(initialUrl);
  console.log("FETCH ", url);

  useEffect(() => {
    if (!url) return;
    setIsLoading(true);
    // clear old search
    setData(null);
    setError(null);

    fetch(url)
      .then(response => response.json())
      .then(data => {
        //console.log("FETCH ", data);
        setIsLoading(false);
        setData(data);
      })
      .catch(error => {
        setIsLoading(false);
        setError(error);
      });
  }, [url]);

  return { data, error, isLoading, setUrl };
};

export default UseFetch;
