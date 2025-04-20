#!/bin/sh

echo "window.env = { VITE_API_PATH: \"${VITE_API_PATH}\" }" > /dist/env.js

serve -s /dist -l 80