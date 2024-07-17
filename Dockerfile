FROM node:18.17.0-alpine
RUN npm install -g npm@9.6.7
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_OPTIONS="--max-old-space-size=2048"
CMD ["npm", "run", "start"]