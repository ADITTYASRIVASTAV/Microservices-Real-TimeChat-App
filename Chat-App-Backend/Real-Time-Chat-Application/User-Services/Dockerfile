FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar user-service.jar
EXPOSE 8082
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "user-service.jar"]