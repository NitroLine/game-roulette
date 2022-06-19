FROM node:14-alpine

ENV PORT=3000

WORKDIR /app/

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]