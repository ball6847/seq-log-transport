import { Logger } from "npm:seq-logging";
import { Config } from "./config.ts";

export function getLogger(config: Config) {
  const logger = new Logger({
    serverUrl: config.seq.server,
    apiKey: config.seq.token,
    onError: (error) => {
      console.error(error);
    },
  });
  return logger;
}
