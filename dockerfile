FROM node:22-alpine

WORKDIR /src

COPY package.json pnpm-lock.yaml./

RUN npm install -g pnpm \
    && pnpm install

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
