FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_OPTIONS="--max-old-space-size=2048"
CMD ["npm", "run", "start"]