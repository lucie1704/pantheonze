ARG MONGO_VERSION=8.0.0
FROM mongo:${MONGO_VERSION}

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
