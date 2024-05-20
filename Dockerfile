# Build Stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . . 

RUN yarn build

# Deploy stage
FROM node:18-alpine AS deploy

WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock /app/tsconfig.build.json /app/.env ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD yarn start:prod
