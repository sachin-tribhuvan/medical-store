#!/bin/sh
# Generates the browser runtime config from environment variables at container start.
set -e
envsubst '${API_URL}' < /etc/nginx/runtime/config.js.template > /usr/share/nginx/html/config.js
echo "runtime config: API_URL=${API_URL}"
