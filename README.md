# CRM Application

A full-stack Customer Relationship Management (CRM) system built with modern technologies and containerized for easy deployment.

## 🚀 Quick Start with Docker

**The easiest way to run the entire application:**

```bash
git clone <your-repo-url>
cd uom-crm
docker compose up --build
```

Then access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432 (user: crm_user, password: secret)

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot 3 (Java 17), Spring Security with JWT, PostgreSQL, Maven
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: Enhanced JWT system with access tokens (15 min) + refresh tokens (7 days)
- **Containerization**: Docker & Docker Compose for one-command deployment
- **Database**: PostgreSQL 15 with automatic schema management

---

## ✨ Key Features

### 🔐 Advanced Authentication & Security

- **Dual Token System**: Short-lived access tokens (15 minutes) + long-lived refresh tokens (7 days)
- **Automatic Token Refresh**: Seamless token renewal without user intervention
- **Session Management**: Track and limit concurrent user sessions (max 3 per user)
- **Role-based Access Control**: ADMIN, SALES, MANAGER roles
- **Secure Token Storage**: HttpOnly cookies + localStorage for optimal security
- **Token Cleanup**: Automatic removal of expired tokens

### 📊 Complete CRM Functionality

- **Contacts Management**: Full CRUD with company associations
- **Companies Management**: Track customer accounts and organizations
- **Opportunities Pipeline**: Manage deals through stages (NEW → QUALIFIED → PROPOSAL → NEGOTIATION → WON/LOST)
- **Activities & Tasks**: Log calls, emails, meetings, notes with due dates and completion tracking
- **Interactive Dashboard**: Real-time metrics, charts, and recent activity summaries

### 🎨 Modern UI/UX

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: User preference with system sync
- **Data Tables**: Sortable, filterable tables with pagination
- **Charts & Analytics**: Interactive charts using Recharts
- **Type-safe API**: End-to-end TypeScript for robust data handling

### 🐳 Production-Ready Deployment

- **One-Command Setup**: `docker compose up --build`
- **Multi-stage Docker builds**: Optimized images for production
- **Data Persistence**: PostgreSQL data survives container restarts
- **Environment Configuration**: Flexible configuration for development and production

---

## 📋 Table of Contents

1. [Quick Start with Docker](#-quick-start-with-docker)
2. [Authentication System](#-authentication-system)
3. [Local Development Setup](#-local-development-setup)
4. [API Documentation](#-api-documentation)
5. [Project Structure](#-project-structure)
6. [Environment Configuration](#-environment-configuration)
7. [Troubleshooting](#-troubleshooting)

---

## 🔐 Authentication System

The application uses an enhanced JWT authentication system with the following features:

### Token Types

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

### Security Configuration

```properties
# Access Token Configuration
jwt.access-token.secret=<secure-secret-key>
jwt.access-token.expiration-minutes=15

# Refresh Token Configuration
jwt.refresh-token.secret=<secure-refresh-secret>
jwt.refresh-token.expiration-days=7
jwt.max-active-refresh-tokens-per-user=5

# Session Management
session.max-active-sessions-per-user=3
session.timeout-minutes=30
```

### Token Flow

1. **Login**: User receives both access and refresh tokens
2. **API Requests**: Access token in Authorization header
3. **Token Refresh**: Automatic renewal when access token expires
4. **Logout**: Both tokens are invalidated and cleaned up

### Security Features

- **Concurrent Session Limits**: Maximum 3 active sessions per user
- **Refresh Token Limits**: Maximum 5 active refresh tokens per user
- **Automatic Cleanup**: Expired tokens are automatically removed
- **Secure Storage**: Tokens stored in HttpOnly cookies and localStorage

### Usage Example

```javascript
// Frontend automatically handles token refresh
const contacts = await fetchClient<ContactDto[]>('/contacts');
// No manual token management needed!
```

---

## 🏠 Local Development Setup

### Prerequisites

- **Java 17** (JDK)
- **Maven 3.8+**
- **Node.js 18+** & **pnpm** (or npm/yarn)
- **Docker** & **Docker Compose** (recommended)
- **PostgreSQL 15** (if not using Docker)

### Option 1: Docker (Recommended)

1. **Clone and start everything**:

   ```bash
   git clone <your-repo-url>
   cd uom-crm
   docker compose up --build
   ```

2. **Access the application**:

   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080/api
   - Database: localhost:5432

3. **Create your first user**:
   - Navigate to http://localhost:3000/register
   - Create an account
   - Login and start using the CRM!

### Option 2: Local Development

#### Backend Setup

```bash
cd backend

# Configure PostgreSQL
createdb crm
createuser crm_user --password secret

# Build and run
mvn clean package
mvn spring-boot:run
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
pnpm install

# Configure environment
echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api" > .env.local
echo "NEXT_PUBLIC_JWT_COOKIE_NAME=crm_jwt" >> .env.local

# Start development server
pnpm dev
```

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description          | Request Body                        | Response                        |
| ------ | -------------------- | -------------------- | ----------------------------------- | ------------------------------- |
| POST   | `/api/auth/register` | Register new user    | `{ username, email, passwordHash }` | `200 OK`                        |
| POST   | `/api/auth/login`    | Login user           | `{ username, password }`            | `{ accessToken, refreshToken }` |
| POST   | `/api/auth/refresh`  | Refresh access token | `{ refreshToken }`                  | `{ accessToken, refreshToken }` |
| POST   | `/api/auth/logout`   | Logout user          | -                                   | `200 OK`                        |
| GET    | `/api/auth/profile`  | Get user profile     | -                                   | `UserInfoDto`                   |

### Core Entities

| Entity            | Base Endpoint        | Key Features                                           |
| ----------------- | -------------------- | ------------------------------------------------------ |
| **Companies**     | `/api/companies`     | CRUD operations, search, industry filtering            |
| **Contacts**      | `/api/contacts`      | CRUD operations, company association, search           |
| **Opportunities** | `/api/opportunities` | CRUD operations, stage management, revenue tracking    |
| **Activities**    | `/api/activities`    | CRUD operations, task management, calendar integration |

### Enhanced Endpoints

| Method | Endpoint                           | Description                   |
| ------ | ---------------------------------- | ----------------------------- |
| GET    | `/api/contacts/company/{id}`       | Get contacts by company       |
| GET    | `/api/opportunities/stage/{stage}` | Get opportunities by stage    |
| GET    | `/api/activities/pending`          | Get incomplete tasks due soon |
| GET    | `/api/activities/contact/{id}`     | Get activities for contact    |

### Response Format

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "companyId": 1,
  "jobTitle": "Sales Manager",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**All endpoints (except `/api/auth/*`) require `Authorization: Bearer <access_token>` header.**

---

## 📁 Project Structure

```
uom-crm/
├── 🐳 docker-compose.yml          # One-command deployment
├── 📖 DOCKER_README.md           # Detailed Docker instructions
│
├── 🌱 backend/                    # Spring Boot API
│   ├── 🐳 Dockerfile             # Backend container
│   ├── 📝 .dockerignore          # Docker build optimization
│   ├── 🔧 pom.xml                # Maven dependencies
│   └── src/main/java/com/example/crm/
│       ├── 🚀 CrmBackendApplication.java
│       ├── ⚙️ config/            # Security, JWT, CORS, Exception handling
│       │   ├── SecurityConfig.java
│       │   ├── JwtTokenProvider.java
│       │   ├── JwtAuthenticationFilter.java
│       │   ├── CustomUserDetailsService.java
│       │   └── GlobalExceptionHandler.java
│       ├── 🎮 controller/        # REST API controllers
│       │   ├── AuthController.java
│       │   ├── ContactController.java
│       │   ├── CompanyController.java
│       │   ├── OpportunityController.java
│       │   └── ActivityController.java
│       ├── 📦 dto/               # Data Transfer Objects
│       ├── 🏗️ model/             # JPA Entities and Enums
│       │   ├── User.java
│       │   ├── RefreshToken.java
│       │   ├── UserSession.java
│       │   └── enums/
│       ├── 🗄️ repository/        # Data Access Layer
│       └── 🔧 service/           # Business Logic
│           ├── AuthService.java
│           ├── RefreshTokenService.java
│           ├── SessionService.java
│           └── TokenCleanupService.java
│
└── 🖥️ frontend/                   # Next.js Application
    ├── 🐳 Dockerfile             # Frontend container (multi-stage)
    ├── 📝 .dockerignore          # Docker build optimization
    ├── 📦 package.json           # Node.js dependencies
    ├── ⚙️ next.config.ts         # Next.js configuration (standalone output)
    ├── 📱 app/                   # App Router pages
    │   ├── 🏠 page.tsx           # Dashboard with metrics
    │   ├── 🔐 api/auth/          # Auth API routes
    │   ├── 📋 dashboard/         # Protected dashboard pages
    │   │   ├── layout.tsx        # Dashboard layout with sidebar
    │   │   ├── 👥 contacts/      # Contact management
    │   │   ├── 🏢 companies/     # Company management
    │   │   ├── 💼 opportunities/ # Deal pipeline
    │   │   └── 📋 activities/    # Task management
    │   └── 📝 register/          # User registration
    ├── 🧩 components/            # Reusable UI components
    │   ├── ui/                   # shadcn/ui components
    │   ├── app-sidebar.tsx       # Navigation sidebar
    │   ├── protected-route.tsx   # Route protection
    │   └── theme-toggle.tsx      # Dark/light mode
    ├── 🔗 lib/                   # API helpers and utilities
    │   ├── api/                  # Type-safe API clients
    │   ├── auth-context.tsx      # Authentication context
    │   └── utils.ts              # Utility functions
    └── 🎨 public/               # Static assets
```

---

## ⚙️ Environment Configuration

### Backend Configuration (application.properties)

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/crm
spring.datasource.username=crm_user
spring.datasource.password=secret
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Enhanced JWT Configuration
jwt.access-token.secret=VerySecretKeyForAccessTokenSigning1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
jwt.access-token.expiration-minutes=15
jwt.refresh-token.secret=VerySecretKeyForRefreshTokenSigning0987654321FEDCBAZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210
jwt.refresh-token.expiration-days=7
jwt.max-active-refresh-tokens-per-user=5

# Session Configuration
session.max-active-sessions-per-user=3
session.timeout-minutes=30

# Logging
logging.level.com.example.crm.service=DEBUG
logging.level.com.example.crm.config=DEBUG

# Server Configuration
server.error.include-message=always
server.error.include-binding-errors=always
```

### Frontend Configuration (.env.local)

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Docker Environment

All configuration is automatically handled in `docker-compose.yml`:

- PostgreSQL database with persistent volume
- Backend with proper database connection
- Frontend with API endpoint configuration
- Secure JWT secrets for production

---

## 🐛 Troubleshooting

### Common Issues

**Port Conflicts**

```bash
# Check what's using the ports
lsof -i :3000 :5432 :8080

# Stop conflicting services
sudo kill -9 <PID>
```

**Docker Issues**

```bash
# Clean rebuild everything
docker compose down -v
docker system prune -f
docker compose up --build

# Check specific service logs
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

**Database Connection Issues**

```bash
# Check if database is running and accessible
docker compose logs db
psql -h localhost -U crm_user -d crm

# Restart backend after database is ready
docker compose restart backend
```

**Authentication Issues**

- Clear browser localStorage and cookies
- Check if tokens are expired
- Verify JWT secrets match between services
- Check session limits aren't exceeded

**Build Issues**

```bash
# Backend build issues
cd backend && mvn clean package

# Frontend build issues
cd frontend && pnpm install && pnpm build
```

### Getting Help

- Check service logs: `docker compose logs <service>`
- Ensure all prerequisites are installed
- Verify ports 3000, 5432, and 8080 are available
- Review the detailed Docker guide in `DOCKER_README.md`
- Check application.properties for correct configuration

---

**Ready to get started? Run `docker compose up --build` and start managing your customer relationships! 🚀**

_Built with ❤️ using Spring Boot, Next.js, and Docker_
