FROM golang:1.23.3-alpine3.20

WORKDIR /app

COPY . .

RUN go mod download

RUN go build -o api .

EXPOSE 8000

CMD ["./api"]