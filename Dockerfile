FROM node:20.10.0-alpine AS build
RUN mkdir -p /app
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app/
RUN npm run build

FROM node:20-slim

COPY --from=build /app/dist/client/ dist/client/

CMD ["npm", "run", "serve:ssr:client"]

EXPOSE 4000