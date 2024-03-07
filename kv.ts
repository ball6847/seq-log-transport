const KV_DIR = Deno.env.get("KV_DIR") || "database";
export const kv = await Deno.openKv(`${KV_DIR}/db.kv`);
