import { Logger } from "seq-logging";
import { Tail } from "tail";
import { kv } from "./kv.ts";

export async function startWorker(file: string, logger: Logger) {
  const tail = new Tail(file, { fromBeginning: true });

  // resume from the last offset stored in KV
  const key = file.substring(1).split("/");
  const result = await kv.get<number>(key.concat("offset"));
  const offset = result.value ?? -1;

  console.log(`${file} will be started from line`, offset);

  let i = 0;

  tail.on("line", (line: string) => {
    // skip lines until we reach the offset
    if (i <= offset) {
      i++;
      return;
    }

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

    // keep track of the offset
    kv.set(key.concat("offset"), i);
    i++;
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
