FROM node:18-alpine AS development

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN yarn 

COPY . .
RUN yarn build:fmpm-gateway

FROM node:18-alpine as production
ENV NODE_ENV=production
ENV GATEWAY_PORT=3004
EXPOSE ${GATEWAY_PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/fmpm-gateway ./


COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --production=true

CMD ["node", "main"]