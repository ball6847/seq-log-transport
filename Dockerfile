FROM denoland/deno:alpine-1.41.1
ENV KV_DIR /database
WORKDIR /app
COPY . /src

RUN mkdir /database && \
	deno install --unstable-kv --allow-env --allow-net --allow-read --allow-write --allow-sys -n seq-log-transport --root /usr/local --config /src/deno.json /src/main.ts

VOLUME /database
ENTRYPOINT []
CMD ["/usr/local/bin/seq-log-transport"]
