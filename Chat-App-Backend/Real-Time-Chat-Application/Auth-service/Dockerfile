FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar auth-service.jar
EXPOSE 8081
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "auth-service.jar"]