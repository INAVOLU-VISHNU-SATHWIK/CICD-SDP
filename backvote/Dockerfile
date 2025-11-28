# Stage 1: Build with Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build JAR
RUN mvn clean package -DskipTests

# Stage 2: Run JAR
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 18080

ENTRYPOINT ["java", "-jar", "app.jar"]
