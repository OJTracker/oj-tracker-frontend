const handleError = (error, message) => {
    if (error.response && error.response.status === 401) {
        window.location = "/";
      } else {
        alert("Error: " + error.message + message);
      }
}

export { handleError };
