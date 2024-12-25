FROM node:22.12.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app/webapp

COPY webapp/package.json webapp/pnpm-lock.yaml ./

RUN pnpm install

COPY webapp ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS js-build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM golang:1.23.4-alpine AS go-build

RUN apk add --no-cache gcc musl-dev

WORKDIR /app/server

COPY server/go.mod server/go.sum ./
RUN go mod download

COPY server/ .

RUN CGO_ENABLED=0 GOOS=linux go build -o server


FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=prod-deps /app/webapp/node_modules ./webapp/node_modules

COPY --from=js-build /app/webapp/dist ./webapp/dist

COPY --from=go-build /app/server/server .

ENV PORT=8080

EXPOSE 8080

ENTRYPOINT ["./server"]