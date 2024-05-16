import loggerConfig from "../config/loggerConfig";
import { consoleTransport } from "../lib/logger/transports/consoleTransport";

const logLevels = ["log", "debug", "info", "warn", "error"];

const logger = (level, ...args) => {
  if (logLevels.indexOf(level) >= logLevels.indexOf(loggerConfig.logLevel)) {
    const message = args
      .map((arg) => {
        if (typeof arg === "object") {
          try {
            // Attempt to stringify objects
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg); // Fallback to String for non-serializable objects
          }
        }
        return String(arg); // Convert non-string types to string
      })
      .join(" "); // Join all arguments into a single string

    loggerConfig.transports.forEach((transport) => {
      if (transport === "console") {
        consoleTransport(level, message);
      }
      // Extend with additional transport conditions as needed
    });
  }
};

export const log = (...args) => logger('log', ...args);
export const debug = (...args) => logger("debug", ...args);
export const info = (...args) => logger("info", ...args);
export const warn = (...args) => logger("warn", ...args);
export const error = (...args) => logger("error", ...args);
