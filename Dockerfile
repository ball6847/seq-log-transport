FROM denoland/deno:alpine-1.41.1
WORKDIR /app
COPY . /src

RUN deno install --unstable-kv --allow-net --allow-read --allow-write --allow-sys -n seq-log-transport --root /usr/local/bin /src/main.ts

CMD ["seq-log-transport"]
