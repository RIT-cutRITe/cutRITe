# Build the application into the dist/ folder
FROM node:20-alpine AS build-stage
WORKDIR /vue-i
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /vue-i/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]