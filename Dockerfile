FROM node:12.18.2 as build

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

RUN npm install
COPY . .

RUN npm run build

FROM golang:latest

WORKDIR /go/src/app
COPY --from=build /app/public server/public
COPY ./server/go.mod .
COPY ./server/go.sum .
RUN go mod download
COPY ./server .


EXPOSE 5000
RUN go build -o rest-server main.go
CMD ["./rest-server"]