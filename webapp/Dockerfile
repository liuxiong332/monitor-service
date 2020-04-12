# ---- Base Node ----
FROM node:slim AS build

ARG REACT_APP_SERVICE_HOST
ARG REACT_APP_SERVICE_PORT
ARG REACT_APP_MINIO_HOST
ARG REACT_APP_MINIO_PORT

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
# install app dependencies including 'devDependencies'
RUN npm install

VOLUME [ "/app/node_modules" ]

COPY src ./src/
COPY public ./public/
RUN npm run build

# Build react/vue/angular bundle static files
# RUN npm run build

# --- Release with Nginx Alpine ----
FROM nginx:stable-alpine
   
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]