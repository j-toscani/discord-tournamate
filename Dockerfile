FROM node:lts-alpine

COPY . .

RUN npm run build:ci

CMD ["node", "dist/index.js"]