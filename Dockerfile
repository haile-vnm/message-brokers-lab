FROM node:20-alpine
LABEL name=mbl version=1.0.0

RUN npm install -g pnpm nx

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm i

CMD [ "nx", "--version" ]
