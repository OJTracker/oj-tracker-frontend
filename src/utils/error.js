const handleError = (error, message) => {
    if (error.response && error.response.status === 401) {
        window.location = "/ojtracker";
      } else {
        if (error.response?.data) alert("Error: " + error.response.data);
        else alert("Error: " + error.message + (message ? message : ""));
      }
}

export { handleError };
