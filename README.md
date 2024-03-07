# seq-log-transport

Watch and ship json structured log files to seq server

## Getting started

Deno must be installed on system

```sh
deno install --unstable-kv --allow-net --allow-read --allow-write --allow-sys -n seq-log-transport https://cdn.jsdelivr.net/gh/ball6847/seq-log-transport@b78b186/main.ts
```

Create a config file

```yaml
sources:
- /app/logs/*.jsonl

seq:
  server: http://seq:5341
  token: your-seq-token-here

# optional watcher.interval (default: 1000ms)
# watcher:
#   interval: 1000
```

Run the cli

```sh
seq-log-transport -c config.yml
```

The log files will be watched for changes line-by-line as json and ship to destination seq server

## JSON attribute format

The cli requires each log entry to contain the following field

- `datetime` for using as timestamp, can be any value that javascript Date object accept
- `level` any string that will be passed as log level, for example `INFO`, `DEBUG`, `ERROR`
- `message` this will be passed as `messageTemplate` (feel free to adjust the template here)

Anything else will be passed as log properties that can be used for `messageTemplate` or can be used later to query the logs on Seq admin ui

TODO: implement field mappings for `datetime`, `level` and `message`, as this might not always be in of our control.
