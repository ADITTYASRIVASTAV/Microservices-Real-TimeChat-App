FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar notification-service.jar
EXPOSE 8084
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "notification-service.jar"]