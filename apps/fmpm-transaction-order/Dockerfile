FROM node:18-alpine as development

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build:fmpm-transaction-order

FROM node:18-alpine as production
ENV NODE_ENV=production
ENV TRANSACTION_PORT=3007
EXPOSE ${TRANSACTION_PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/fmpm-transaction-order ./

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --production=true

CMD ["node", "main"]