FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar admin-server.jar
EXPOSE 8090
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "admin-server.jar"]