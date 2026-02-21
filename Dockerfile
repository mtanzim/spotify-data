
FROM oven/bun:1.3.9 AS build



WORKDIR /app

COPY package.json ./
COPY bun.lock ./

RUN bun install
COPY . .
RUN bun run build

FROM golang:tip-alpine3.22

WORKDIR /go/src/app
COPY --from=build /app/public public
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .


EXPOSE 5000
RUN go build -o rest-server cmd/server/main.go
CMD ["./rest-server"]