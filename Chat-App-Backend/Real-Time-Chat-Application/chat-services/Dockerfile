FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar chat-service.jar
EXPOSE 8083
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "chat-service.jar"]