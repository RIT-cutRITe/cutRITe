# Build the application into the dist/ folder
FROM node:24-alpine AS build-stage
WORKDIR /vue-i
COPY vue-i/package.json ./
COPY vue-i/yarn.lock ./
RUN yarn install
COPY vue-i/. .
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN yarn run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /vue-i/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
