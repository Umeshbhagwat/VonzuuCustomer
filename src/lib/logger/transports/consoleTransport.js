export const consoleTransport = (level, message) => {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  switch (level) {
    case "debug":
      // Use console.log for debug to avoid cluttering the console with low severity messages
      console.log(formattedMessage);
      break;
    case "info":
      // console.info can be used here for informational messages
      console.info(formattedMessage);
      break;
    case "warn":
      // console.warn provides warnings that are highlighted in yellow in most consoles
      console.warn(formattedMessage);
      break;
    case "error":
      // console.error is used for errors and is typically highlighted in red
      console.error(formattedMessage);
      break;
    default:
      // Fallback to console.log if the log level is not recognized
      console.log(formattedMessage);
      break;
  }
};
