FROM node:18.17.0-alpine
RUN npm install -g npm@9.6.7
WORKDIR /app
COPY package*.json ./
COPY . .
ENV NODE_OPTIONS="--max-old-space-size=2048"
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]