FROM node:22-slim AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:22-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm ci --omit=dev
EXPOSE 5000
CMD ["node", "dist/main.js"]
