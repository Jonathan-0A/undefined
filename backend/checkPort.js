import net from "net";

/**
 * Function to check if a port is in use, with retry logic.
 * @param {number} port - The port number to check.
 * @param {function} callback - Callback function that receives whether the port is in use.
 * @param {number} [retryDelay=1000] - Delay between retries if the port is in use.
 * @param {number} [maxRetries=5] - Maximum number of retries before giving up.
 */
function checkPort(port, callback, retryDelay = 1000, maxRetries = 5) {
  let retries = 0;

  function attemptCheck() {
    const server = net.createServer();

    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        retries += 1;
        if (retries < maxRetries) {
          console.log(`Port ${port} is in use. Retrying in ${retryDelay}ms... (${retries}/${maxRetries})`);
          setTimeout(attemptCheck, retryDelay); // Retry after a delay
        } else {
          console.error(`Port ${port} is still in use after ${maxRetries} retries. Please check for issues.`);
          callback(true); // Give up after max retries
        }
      } else {
        console.error(`Unexpected error while checking port ${port}:`, err);
        callback(false); // Handle other errors
      }
    });

    server.once("listening", () => {
      server.close(); // Close the server after confirming the port is available
      callback(false); // Port is available
    });

    server.listen(port);
  }

  attemptCheck();
}

export default checkPort;
