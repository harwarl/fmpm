FROM node:18-alpine as development

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build:fmpm-grpc-rate

FROM node:18-alpine as production
ENV NODE_ENV=production
ENV INTEGRATION_GRPC_PORT=3005
EXPOSE ${INTEGRATION_GRPC_PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/fmpm-grpc-rate ./

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --production=true

CMD ["node", "main"]