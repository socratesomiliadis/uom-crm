# CRM Application - Docker Setup

This guide explains how to run the complete CRM application stack using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your system
- At least 4GB of available RAM
- Ports 3000, 5432, and 8080 available on your host machine

## Architecture

The application consists of three services:

- **PostgreSQL Database** (port 5432): Stores application data
- **Spring Boot Backend** (port 8080): REST API server
- **Next.js Frontend** (port 3000): Web application interface

## Quick Start

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repo-url>
   cd uom-crm
   ```

2. **Start the entire application stack**:

   ```bash
   docker compose up --build
   ```

   This command will:

   - Build the Spring Boot backend Docker image
   - Build the Next.js frontend Docker image
   - Pull the PostgreSQL image
   - Start all services in the correct order

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - Database: localhost:5432 (username: crm_user, password: secret)

## Available Commands

### Start all services (build if needed)

```bash
docker compose up --build
```

### Start all services in background

```bash
docker compose up -d --build
```

### Stop all services

```bash
docker compose down
```

### Stop all services and remove volumes (WARNING: This will delete all data)

```bash
docker compose down -v
```

### View logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

### Rebuild a specific service

```bash
# Rebuild backend only
docker compose build backend
docker compose up backend

# Rebuild frontend only
docker compose build frontend
docker compose up frontend
```

## Environment Variables

The following environment variables are configured in docker-compose.yml:

### Database (PostgreSQL)

- `POSTGRES_DB=crm`
- `POSTGRES_USER=crm_user`
- `POSTGRES_PASSWORD=secret`

### Backend (Spring Boot)

- `SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/crm`
- `SPRING_DATASOURCE_USERNAME=crm_user`
- `SPRING_DATASOURCE_PASSWORD=secret`
- `SPRING_JPA_HIBERNATE_DDL_AUTO=update`
- `SPRING_PROFILES_ACTIVE=docker`
- `JWT_SECRET=VerySecretKeyForJwtSigning1234567890`
- `JWT_EXPIRATION_MS=86400000`

### Frontend (Next.js)

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`
- `NEXT_PUBLIC_JWT_COOKIE_NAME=crm_jwt`

## Data Persistence

The PostgreSQL database data is persisted in a Docker volume named `db-data`. This means your data will survive container restarts.

To completely reset the database:

```bash
docker compose down -v
docker compose up --build
```

## Troubleshooting

### Port Conflicts

If you get port conflict errors, make sure ports 3000, 5432, and 8080 are not being used by other applications.

### Build Issues

If you encounter build issues:

```bash
# Clean everything and rebuild
docker compose down -v
docker system prune -f
docker compose up --build
```

### Database Connection Issues

If the backend can't connect to the database:

```bash
# Check if database is running
docker compose logs db

# Restart the backend after database is ready
docker compose restart backend
```

### Frontend API Connection Issues

If the frontend can't reach the backend API, verify that:

- The backend service is running: `docker compose logs backend`
- The backend is accessible at: http://localhost:8080/api

## Development Mode

For development, you might want to run services individually:

```bash
# Start only the database
docker compose up db

# Start database and backend
docker compose up db backend

# Run frontend in development mode locally
cd frontend
npm run dev
```

## Production Considerations

For production deployment:

1. **Change default passwords** in docker-compose.yml
2. **Use environment files** instead of hardcoded values
3. **Configure proper JWT secrets**
4. **Set up proper network security**
5. **Configure SSL/TLS certificates**
6. **Set up proper logging and monitoring**

## Support

If you encounter any issues:

1. Check the logs: `docker compose logs`
2. Ensure all prerequisites are met
3. Try rebuilding: `docker compose up --build`
4. Check port availability
