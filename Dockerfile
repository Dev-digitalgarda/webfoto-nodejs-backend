FROM node:lts-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run transpile:source && \
    rm -r source node_modules
RUN npm ci --only=prod
CMD ["npm", "start"]