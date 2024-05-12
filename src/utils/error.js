const handleError = (error, message) => {
    if (error.response && error.response.status === 401) {
        window.location = "/";
      } else {
        if (error.response.data) alert("Error: " + error.response.data);
        else alert("Error: " + error.message + message);
      }
}

export { handleError };
