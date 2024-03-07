import fg from "fast-glob";
import { Logger } from "seq-logging";
import { Config } from "./config.ts";
import { startWorker } from "./worker.ts";

const watched: string[] = [];

export async function watch(config: Config, logger: Logger) {
  const files = await fg.glob(config.sources);

  // start watching new file and add it to the list
  // in case of file deletion, the worker will handle by itself
  for (const file of files) {
    if (!watched.includes(file)) {
      watched.push(file);
      startWorker(file, logger);
    }
  }

  // remove files that are not in the list anymore, to save resources
  watched.forEach((file, index) => {
    if (!files.includes(file)) {
      watched.splice(index, 1);
    }
  });
}
