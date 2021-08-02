##
## Build
##

FROM golang:1.16-buster AS build

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

RUN go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/,direct && go mod download

COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /docker-gs-ping

##
## Deploy
##

FROM scratch

WORKDIR /

COPY --from=build /docker-gs-ping /docker-gs-ping

EXPOSE 8080

ENTRYPOINT ["/docker-gs-ping"]