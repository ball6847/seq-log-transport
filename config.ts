import yaml from "npm:yaml@2.4.1";
import { z } from "npm:zod@3.0.0";

const schema = z.object({
  sources: z.array(z.string()).min(1),
  seq: z.object({
    server: z.string().url(),
    token: z.string(),
  }),
  watcher: z
    .object({
      interval: z.number().optional().default(1000),
    })
    .optional(),
});

export type Config = z.infer<typeof schema>;

export async function read(filename: string): Promise<Config> {
  const file = await Deno.readTextFile(filename); // TODO: not sure what kind of error will be thrown
  const config = yaml.parse(file); // YAMLParseError will be thrown if the file is not valid
  schema.parse(config); // ZodError will be thrown
  return config as Config;
}
