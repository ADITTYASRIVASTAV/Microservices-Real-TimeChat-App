FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/*.jar eureka-server.jar
EXPOSE 8761
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "eureka-server.jar"]