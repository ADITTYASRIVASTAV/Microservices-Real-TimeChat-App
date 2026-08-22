FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar api-gateway.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "api-gateway.jar"]