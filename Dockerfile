FROM node:alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /api
RUN apk update && apk add --no-cache python3 python3-dev build-base openjdk11 gcc g++
COPY package.json .
RUN npm install
COPY . .
RUN mkdir -p /api/runtime
RUN chown -R appuser:appgroup /api
RUN chmod -R u+w /api
RUN chmod -R a-w /api
RUN chmod -R u+w /api/runtime

USER appuser
EXPOSE 3001
ENV NODE_ENV=production

CMD ["npm", "run","dev"]