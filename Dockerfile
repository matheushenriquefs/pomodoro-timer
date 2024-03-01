FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY package*.json .

RUN npm install

RUN mv node_modules /node_modules

COPY . .

RUN npm run build

RUN chmod +x ./entrypoint.sh

EXPOSE 3000 3333

ENTRYPOINT ["./entrypoint.sh"]
