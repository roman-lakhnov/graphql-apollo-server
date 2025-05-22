#!/bin/bash
set -e
# Build Docker image
docker build -t docker-apollo-server .
# Create Docker volumes if they don't exist
docker volume create apollo-data
docker volume create apollo-logs

# Stop and remove existing container if it exists
if [ "$(docker ps -aq -f name=docker-apollo-server-container)" ]; then
    echo "Stopping and removing existing container..."
    docker stop docker-apollo-server-container
    docker rm docker-apollo-server-container
fi

# Run new container with named volumes
docker run -d \
  -p 4000:4000 \
  --name docker-apollo-server-container \
  --volume apollo-data:/usr/src/app/data \
  --volume apollo-logs:/usr/src/app/logs \
  docker-apollo-server

echo "Deployment complete. Apollo server is running at http://localhost:4000"
exit 0