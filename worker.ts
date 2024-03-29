import { Logger } from "seq-logging";
import { Tail } from "tail";

export function startWorker(file: string, logger: Logger) {
  const tail = new Tail(file, { fromBeginning: false });

  tail.on("line", (line: string) => {
    // process the log line
    try {
      const log = JSON.parse(line);
      const ts = new Date(log.datetime);
      const level = log.level;
      const message = log.message;
      delete log.datetime;
      delete log.level;
      delete log.message;

      logger.emit({
        timestamp: new Date(ts),
        level: level,
        messageTemplate: message,
        properties: log,
      });
    } catch (error) {
      console.error("log processing error", error);
    }
  });

  tail.on("error", (error: Error | string) => {
    // stop watching if the file got deleted
    if (typeof error === "string" && error.includes("ENOENT")) {
      console.log(`stop watching ${file} because it was deleted`);
      tail.unwatch();
      return;
    }
    // anything else, just log it so we can investigate
    console.error("tail error", error);
  });

  tail.watch();
}
