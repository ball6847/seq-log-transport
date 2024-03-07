import { to } from "await-to-js";
import { Command } from "cliffy";
import { read } from "./config.ts";
import { getLogger } from "./logger.ts";
import { watch } from "./watcher.ts";

await new Command()
  .name("seq-log-transport")
  .description("A simple log transporter for seq")
  .option("-c, --config <file:string>", "Config file", {
    default: "config.yml",
  })
  .action(async ({ config: configFile }) => {
    // parse config
    const [configErr, config] = await to(read(configFile));
    if (configErr) {
      console.error(`Error reading config file: ${configFile}, ${configErr}`);
      return;
    }

    const logger = getLogger(config);
    const interval = config.watcher?.interval || 1000;

    setInterval(async () => await watch(config, logger), interval);
  })
  .parse(Deno.args);
