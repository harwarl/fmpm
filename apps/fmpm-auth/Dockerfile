FROM node:18-alpine as development

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .
RUN yarn build:fmpm-auth

FROM node:18-alpine as production
ENV NODE_ENV=production
ENV AUTH_PORT=3003
EXPOSE ${AUTH_PORT}

USER node
WORKDIR /app

COPY --from=development /app/dist/apps/fmpm-auth ./

COPY package*.json ./
COPY yarn*.lock ./
RUN yarn install --production=true

CMD ["node", "main"]