FROM oven/bun
WORKDIR /usr/src/app

COPY package.json .
RUN bun install
COPY . .

# run the app
EXPOSE 3000/tcp