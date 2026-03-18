FROM node:22-alpine
WORKDIR /app

ENV PORT=5000

COPY package*.json ./
RUN npm ci --include=dev


COPY . .
RUN npm run build && npm prune --omit=dev

EXPOSE 5000

CMD ["node", "dist/server.js"]
