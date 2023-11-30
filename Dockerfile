# install
FROM node:16-alpine AS base
WORKDIR /base
COPY package*.json ./
COPY . .
RUN npm ci -only=prod --omit=dev --ignore-scripts

# build
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

# run
FROM node:16-alpine AS app
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /build/node_modules ./node_modules/
COPY --from=build /build/public ./public
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static

EXPOSE 3000
ENV NEXTAUTH_SECRET=test123
ENV NODE_ENV=production
CMD [ "node", "server.js" ]