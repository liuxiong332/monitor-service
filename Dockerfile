FROM registry.cn-hangzhou.aliyuncs.com/acs/maven:3-jdk-8 AS build
COPY src /usr/src/app/src
COPY pom.xml /usr/src/app
RUN mvn -f /usr/src/app/pom.xml clean package -Dmaven.test.skip=true  

FROM openjdk:8-jdk-alpine
COPY --from=build /usr/src/app/target/monitor-0.0.1-SNAPSHOT.jar /usr/app/monitor.jar
# ARG JAR_FILE=target/*.jar
# COPY ${JAR_FILE} app.jar
WORKDIR /usr/app/
EXPOSE 8080/udp

ENV MYSQL_HOST=localhost MYSQL_PORT=3306 REDIS_HOST=localhost REDIS_PORT=6379
ENTRYPOINT ["java","-jar","monitor.jar"]