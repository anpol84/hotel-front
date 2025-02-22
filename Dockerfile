FROM node:15.12.0

WORKDIR /app

ADD . .

RUN npm install

CMD ["npm", "run", "dev"]