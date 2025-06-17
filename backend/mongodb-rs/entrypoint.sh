#!/bin/bash
set -e

# Démarrer MongoDB
mongod --port "$MONGO_REPLICA_PORT" --replSet rs0 --bind_ip 0.0.0.0 &
MONGOD_PID=$!

# Attendre que MongoDB soit prêt
until mongo --port "$MONGO_REPLICA_PORT" --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  echo "Waiting for MongoDB to be ready..."
  sleep 2
done

# Initialiser le replica set
echo "Initializing replica set..."
mongo --port "$MONGO_REPLICA_PORT" --eval "
  rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT', priority: 1 }
    ]
  });
"

# Attendre que le replica set soit prêt
until mongo --port "$MONGO_REPLICA_PORT" --eval "rs.status().ok" >/dev/null 2>&1; do
  echo "Waiting for replica set to be ready..."
  sleep 2
done

echo "REPLICA SET ONLINE"
wait $MONGOD_PID
