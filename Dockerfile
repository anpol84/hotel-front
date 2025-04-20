FROM node:current-slim as builder

WORKDIR /client

COPY /src /src
COPY index.html /
COPY package*.json /
COPY vite.config.js /
COPY /public /public
COPY eslint.config.js /client

RUN npm ci && npm run build

FROM node:current-slim

COPY --from=builder /dist ./dist
RUN npm install -g serve

COPY start.sh /start.sh
RUN chmod +x /start.sh

ENV PORT=80
EXPOSE 80
CMD ["/start.sh"]