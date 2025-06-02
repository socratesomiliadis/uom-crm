# CRM Application

A full-stack Customer Relationship Management (CRM) system built with:

- **Backend**: Spring Boot (Java 17), Spring Data JPA, Spring Security (JWT), PostgreSQL
- **Frontend**: Next.js (App Router) + React (TypeScript), Tailwind CSS, shadcn/ui, Recharts
- **Containerization**: Docker & Docker Compose

This project provides a REST API for managing contacts, companies, opportunities, and activities, along with a modern React/TypeScript frontend that consumes those endpoints in a type-safe manner.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Project Structure](#project-structure)
5. [Getting Started (Local Development)](#getting-started-local-development)

   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)

6. [Running with Docker Compose](#running-with-docker-compose)
7. [Database Seeding](#database-seeding)
8. [API Endpoints](#api-endpoints)
9. [Frontend–Backend Integration](#frontend–backend-integration)

   - [TypeScript Types & API Helpers](#typescript-types--api-helpers)

10. [Testing](#testing)
11. [Environment Variables](#environment-variables)
12. [Contributing](#contributing)
13. [License](#license)

---

## Features

- **User Authentication & Authorization**

  - JWT-based login/register
  - Role-based access (ADMIN, SALES, MANAGER)

- **Contacts Management**

  - Create, Read, Update, Delete (CRUD) contacts
  - Associate contacts with companies

- **Companies Management**

  - CRUD for companies (accounts)

- **Opportunities (Deals)**

  - Track pipeline stages (NEW, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST)
  - Associate opportunities with contacts

- **Activities & Tasks**

  - Log calls, emails, meetings, notes, tasks
  - Mark tasks as completed, set due dates
  - Associate activities with contacts and users

- **Dashboard**

  - Summary cards (Total Contacts, Open Deals, Activities Today, New Leads)
  - “Deals by Stage” chart with Recharts (pie chart)
  - Recent Activities table
  - Contacts list table

- **Type-Safe API Integration**

  - Shared TypeScript interfaces matching Java DTOs
  - `fetchDirect<T>` (server) & `fetchClient<T>` (client) helpers returning typed data

- **Containerized**

  - Dockerfiles for backend and frontend
  - `docker-compose.yml` to orchestrate Postgres, Spring Boot, and Next.js

---

## Tech Stack

- **Backend**

  - Java 17
  - Spring Boot 3 (Web, Data JPA, Security)
  - PostgreSQL 15
  - JWT (io.jsonwebtoken\:jjwt)
  - Hibernate (JPA)
  - Maven build
  - Lombok (optional, for boilerplate reduction)

- **Frontend**

  - Next.js 13+ (App Router)
  - React 18+ (TypeScript)
  - Tailwind CSS
  - shadcn/ui (UI components)
  - lucide-react (icons)
  - Recharts (data visualization)
  - Axios or built-in `fetch` for HTTP calls

- **Dev Tools**

  - Docker & Docker Compose
  - psql / pgAdmin (Postgres client)
  - Postman or Insomnia (API testing)

---

## Prerequisites

1. **Java 17** (JDK)
2. **Maven 3.8+**
3. **Node.js 18+** & **Yarn** (or npm)
4. **Docker** & **Docker Compose** (for containerized development)
5. **PostgreSQL** (local installation if not using Docker)
6. (Optional) **Postman** or **Insomnia** for testing REST endpoints

---

## Project Structure

```
project-root/
├── backend/                      # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/crm/
│   │   │   │   ├── CrmBackendApplication.java
│   │   │   │   ├── config/       # SecurityConfig, JwtTokenProvider, CORS, Seeder
│   │   │   │   ├── controller/   # REST controllers (Auth, Contacts, Companies, etc.)
│   │   │   │   ├── dto/          # Data Transfer Objects (AuthRequest, CompanyDto, etc.)
│   │   │   │   ├── model/        # Entities & Enums (User, Contact, Company, etc.)
│   │   │   │   ├── repository/   # Spring Data JPA Repositories
│   │   │   │   └── service/      # Business logic services
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql      # (Optional) SQL seed data
│   │   └── test/                 # Unit/integration tests
│   └── pom.xml                   # Maven POM
│   └── Dockerfile                # Build & package Spring Boot into a JAR
│
├── frontend/                     # Next.js + React (TypeScript)
│   ├── app/                      # App Router pages
│   │   ├── layout.tsx            # Root layout (Sidebar, Header)
│   │   ├── page.tsx              # Dashboard (Server Component)
│   │   ├── login/page.tsx        # Login (Client Component)
│   │   ├── contacts/
│   │   │   ├── page.tsx          # Contacts list (Server Comp)
│   │   │   └── [id]/             # Dynamic: view & edit contact
│   │   │       ├── page.tsx      # Contact detail (Server Comp)
│   │   │       └── edit.tsx      # Edit Contact form (Client Comp)
│   │   ├── companies/            # Similar structure for companies
│   │   ├── opportunities/
│   │   └── activities/
│   ├── components/               # Shared UI components (Sidebar, Header, Tables, etc.)
│   ├── lib/                      # API helper (fetchDirect, fetchClient)
│   ├── types/                    # Shared TS interfaces (CompanyDto, ContactDto, etc.)
│   ├── public/                   # Static assets (favicon, images)
│   ├── Dockerfile                # Build Next.js production image
│   ├── next.config.js            # Next.js configuration
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml            # Orchestrate Postgres, backend, frontend
└── README.md                     # ← You are here
```

---

## Getting Started (Local Development)

Below are instructions for running both backend and frontend locally (without Docker). If you prefer a containerized setup, skip to [Running with Docker Compose](#running-with-docker-compose).

### Backend Setup

1. **Configure PostgreSQL**

   - Install PostgreSQL (v13+ recommended) on your machine.
   - Create a database called `crm`.
   - Create a database user `crm_user` with password `secret` (you can change these, but update `application.properties` accordingly).

   ```sql
   CREATE DATABASE crm;
   CREATE USER crm_user WITH ENCRYPTED PASSWORD 'secret';
   GRANT ALL PRIVILEGES ON DATABASE crm TO crm_user;
   ```

2. **Clone & Build**

   ```bash
   git clone <this-repo-url>
   cd <repo-root>/backend
   ```

3. **Configure `application.properties`** (in `src/main/resources`)
   By default, it uses:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/crm
   spring.datasource.username=crm_user
   spring.datasource.password=secret

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   jwt.secret=VerySecretKeyForJwtSigning1234567890
   jwt.expiration-ms=86400000   # 1 day in ms

   spring.security.user.name=admin
   spring.security.user.password=admin
   ```

   - If you change DB credentials or JWT settings, update here or set environment variables (see [Environment Variables](#environment-variables)).

4. **(Optional) Seed Database**

   - **Option A: `data.sql`**
     In `src/main/resources/data.sql`, add INSERT statements. On startup, Spring Boot will run them automatically.
   - **Option B: Java Seeder**
     A `DatabaseSeeder` bean (implements `ApplicationRunner`) seeds if tables are empty. No additional config needed—just restart the app.

5. **Run the Backend**

   ```bash
   mvn clean package
   mvn spring-boot:run
   ```

   - The API will be available at **`http://localhost:8080/api`**.
   - Check logs to ensure it connected to Postgres, created tables, and (if seeder active) inserted initial data.

6. **Verify with cURL / Postman**

   - **Register a new user**

     ```bash
     curl -X POST http://localhost:8080/api/auth/register \
       -H "Content-Type: application/json" \
       -d '{"username":"testuser","email":"test@example.com","passwordHash":"password123"}'
     ```

   - **Login**

     ```bash
     curl -X POST http://localhost:8080/api/auth/login \
       -H "Content-Type: application/json" \
       -d '{"username":"testuser","password":"password123"}'
     ```

     → Returns `{ "token": "<jwt_token_here>" }`.

   - **Protected Endpoint (Get Contacts)**

     ```bash
     curl -H "Authorization: Bearer <jwt_token_here>" \
       http://localhost:8080/api/contacts
     ```

---

### Frontend Setup

1. **Navigate to Frontend**

   ```bash
   cd <repo-root>/frontend
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   # or: npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` in `frontend/`:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
   NEXT_PUBLIC_JWT_COOKIE_NAME=crm_jwt
   ```

   - These settings tell Next.js where to find your Spring Boot API and what cookie name holds the JWT.

4. **Run Development Server**

   ```bash
   yarn dev
   # or: npm run dev
   ```

   - The app will be available at **`http://localhost:3000`**.
   - You should see the login page.

5. **Login Flow**

   - Navigate to `http://localhost:3000/login`.
   - Enter the credentials you registered via Postman (e.g., `testuser` / `password123`).
   - On success, Next.js stores the JWT in `localStorage` & cookie, then redirects to `/` (Dashboard).

6. **Navigate the App**

   - **Dashboard** (`/`)
   - **Contacts** (`/contacts`)
   - **Add Contact** (`/contacts/new`)
   - **View Contact** (`/contacts/:id`)
   - **Edit Contact** (`/contacts/:id/edit`)
   - Similarly for **Companies**, **Opportunities**, and **Activities**.

---

## Running with Docker Compose

If you prefer a containerized environment (recommended for ease of setup and consistent environments), follow these steps:

1. **Ensure Docker & Docker Compose are installed**

   - [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows, macOS) or Docker Engine & Compose (Linux).

2. **Place `docker-compose.yml` at Project Root**
   Example `docker-compose.yml`:

   ```yaml
   version: "3.8"

   services:
     db:
       image: postgres:15
       restart: always
       environment:
         POSTGRES_DB: crm
         POSTGRES_USER: crm_user
         POSTGRES_PASSWORD: secret
       volumes:
         - db-data:/var/lib/postgresql/data
       ports:
         - "5432:5432"

     backend:
       build:
         context: ./backend
         dockerfile: Dockerfile
       container_name: crm-backend
       restart: on-failure
       environment:
         SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/crm
         SPRING_DATASOURCE_USERNAME: crm_user
         SPRING_DATASOURCE_PASSWORD: secret
         SPRING_JPA_HIBERNATE_DDL_AUTO: update
         SPRING_PROFILES_ACTIVE: docker
         JWT_SECRET: VerySecretKeyForJwtSigning1234567890
         JWT_EXPIRATION_MS: 86400000
       ports:
         - "8080:8080"
       depends_on:
         - db

     frontend:
       build:
         context: ./frontend
         dockerfile: Dockerfile
       container_name: crm-frontend
       restart: on-failure
       environment:
         NEXT_PUBLIC_API_BASE_URL: http://backend:8080/api
         NEXT_PUBLIC_JWT_COOKIE_NAME: crm_jwt
       ports:
         - "3000:3000"
       depends_on:
         - backend

   volumes:
     db-data:
   ```

3. **Build & Start All Services**
   From project root (where `docker-compose.yml` resides):

   ```bash
   docker-compose up --build
   ```

   - This will spin up:

     1. **PostgreSQL** (`db`)
     2. **Spring Boot** backend (`backend`)
     3. **Next.js** frontend (`frontend`)

4. **Access the Application**

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API (for testing): [http://localhost:8080/api](http://localhost:8080/api)
   - PostgreSQL on host `localhost:5432` using `crm_user` / `secret`.

5. **Stopping Containers**

   ```bash
   docker-compose down
   ```

   - This removes the containers but preserves the `db-data` volume (data persists).
   - To completely remove volumes:

     ```bash
     docker-compose down --volumes
     ```

---

## Database Seeding

You can seed the database automatically in two ways:

### 1. Using `data.sql`

- Place a `data.sql` file in `backend/src/main/resources/`.
- On application startup (with `spring.jpa.hibernate.ddl-auto=update` or `create`), Spring Boot runs `data.sql` and executes all INSERT statements.
- Example `data.sql` (simplified):

  ```sql
  INSERT INTO users (username, email, password_hash, role, created_at, updated_at)
  VALUES ('admin','admin@example.com','$2a$10$7qGflXlU8.hM7xIh8qwoNeQCqMoxQaG98rZcYF5m7hxQN6nFGoYmK','ADMIN',NOW(),NOW());

  INSERT INTO companies (name, industry, website, city, country, created_at, updated_at)
  VALUES ('Acme Corp','Manufacturing','https://acme.example.com','Metropolis','USA',NOW(),NOW());

  INSERT INTO contacts (company_id, first_name, last_name, email, phone, job_title, created_at, updated_at)
  VALUES (1,'Jane','Doe','jane.doe@acme.example.com','555-1234','Procurement Manager',NOW(),NOW());

  INSERT INTO opportunities (contact_id, title, amount, stage, close_date, created_at, updated_at)
  VALUES (1,'Q3 Widget Order',25000.00,'NEW','2025-09-30',NOW(),NOW());

  INSERT INTO activities (contact_id, user_id, type, subject, description, activity_date, due_date, completed, created_at, updated_at)
  VALUES (1,1,'CALL','Intro Call','Discussed specs',NOW(),NOW() + INTERVAL '2 days',FALSE,NOW(),NOW());
  ```

### 2. Using `DatabaseSeeder` (Java)

- A Spring component (`@Component`) that implements `ApplicationRunner`.
- Checks if tables are empty, then uses JPA repositories to insert default data programmatically.
- Runs automatically on application startup (unless a specific profile excludes it).

---

## API Endpoints

### Authentication

| Method | URL                  | Description         | Request Body                              | Response                                       |
| ------ | -------------------- | ------------------- | ----------------------------------------- | ---------------------------------------------- |
| POST   | `/api/auth/register` | Register a new user | `{ "username", "email", "passwordHash" }` | `200 OK` (text “User registered successfully”) |
| POST   | `/api/auth/login`    | Login & receive JWT | `{ "username", "password" }`              | `{ "token": "<jwt_token>" }`                   |

### Companies

| Method | URL                   | Description             | Request Body (JSON)  | Response         |
| ------ | --------------------- | ----------------------- | -------------------- | ---------------- |
| GET    | `/api/companies`      | List all companies      | —                    | `CompanyDto[]`   |
| GET    | `/api/companies/{id}` | Get company by ID       | —                    | `CompanyDto`     |
| POST   | `/api/companies`      | Create new company      | `CompanyDto` (no ID) | `CompanyDto`     |
| PUT    | `/api/companies/{id}` | Update existing company | `CompanyDto`         | `CompanyDto`     |
| DELETE | `/api/companies/{id}` | Delete company          | —                    | `204 No Content` |

### Contacts

| Method | URL                           | Description             | Request Body (JSON)  | Response         |
| ------ | ----------------------------- | ----------------------- | -------------------- | ---------------- |
| GET    | `/api/contacts`               | List all contacts       | —                    | `ContactDto[]`   |
| GET    | `/api/contacts/company/{cid}` | Contacts by company ID  | —                    | `ContactDto[]`   |
| GET    | `/api/contacts/{id}`          | Get contact by ID       | —                    | `ContactDto`     |
| POST   | `/api/contacts`               | Create new contact      | `ContactDto` (no ID) | `ContactDto`     |
| PUT    | `/api/contacts/{id}`          | Update existing contact | `ContactDto`         | `ContactDto`     |
| DELETE | `/api/contacts/{id}`          | Delete contact          | —                    | `204 No Content` |

### Opportunities

| Method | URL                                | Description                 | Request Body (JSON)      | Response           |
| ------ | ---------------------------------- | --------------------------- | ------------------------ | ------------------ |
| GET    | `/api/opportunities`               | List all opportunities      | —                        | `OpportunityDto[]` |
| GET    | `/api/opportunities/contact/{cid}` | By contact ID               | —                        | `OpportunityDto[]` |
| GET    | `/api/opportunities/stage/{stage}` | By stage (enum in path)     | —                        | `OpportunityDto[]` |
| GET    | `/api/opportunities/{id}`          | Get opportunity by ID       | —                        | `OpportunityDto`   |
| POST   | `/api/opportunities`               | Create new opportunity      | `OpportunityDto` (no ID) | `OpportunityDto`   |
| PUT    | `/api/opportunities/{id}`          | Update existing opportunity | `OpportunityDto`         | `OpportunityDto`   |
| DELETE | `/api/opportunities/{id}`          | Delete opportunity          | —                        | `204 No Content`   |

### Activities

| Method | URL                             | Description               | Request Body (JSON)   | Response         |
| ------ | ------------------------------- | ------------------------- | --------------------- | ---------------- |
| GET    | `/api/activities`               | List all activities       | —                     | `ActivityDto[]`  |
| GET    | `/api/activities/contact/{cid}` | By contact ID             | —                     | `ActivityDto[]`  |
| GET    | `/api/activities/pending`       | Incomplete tasks due soon | —                     | `ActivityDto[]`  |
| GET    | `/api/activities/{id}`          | Get activity by ID        | —                     | `ActivityDto`    |
| POST   | `/api/activities`               | Create new activity       | `ActivityDto` (no ID) | `ActivityDto`    |
| PUT    | `/api/activities/{id}`          | Update existing activity  | `ActivityDto`         | `ActivityDto`    |
| DELETE | `/api/activities/{id}`          | Delete activity           | —                     | `204 No Content` |

> **All endpoints except `/api/auth/**`require a valid`Authorization: Bearer <token>` header.\*\*

---

## Frontend–Backend Integration

### React Environment

- **Server Components** (inside `/app` directory) use `fetchDirect<T>(path)` to call the backend and automatically attach JWT from cookies.
- **Client Components** use `fetchClient<T>(path)` to read JWT from `localStorage` and attach it to requests.

This ensures **type-safe** data fetching; for example:

```ts
import { ContactDto } from "../types/api";

// In a Server Component (e.g. app/contacts/page.tsx):
const contacts: ContactDto[] = await fetchDirect<ContactDto[]>("/contacts");

// In a Client Component:
fetchClient<ContactDto[]>("/contacts").then((data) => {
  /* data is typed as ContactDto[] */
});
```

---

### TypeScript Types & API Helpers

1. **`types/api.ts`**
   Shared TS interfaces that mirror Java DTOs (e.g. `ContactDto`, `CompanyDto`, `OpportunityDto`, `ActivityDto`, `AuthResponse`).

   ```ts
   export interface ContactDto {
     id: number;
     companyId?: number | null;
     firstName: string;
     lastName: string;
     email: string;
     phone?: string | null;
     jobTitle?: string | null;
     createdAt: string;
     updatedAt: string;
   }
   // … other interfaces …
   ```

2. **`lib/api.ts`**

   - `fetchDirect<T>(path, options?)`: Server-side fetch, reads JWT cookie via `cookies()` (Next.js).
   - `fetchClient<T>(path, options?)`: Client-side fetch, reads JWT from `localStorage`.
     Both return `Promise<T>` and throw `Error` on non-2xx.

---

## Testing

### Backend Tests

- Located under `backend/src/test/java/com/example/crm`.
- uses **JUnit 5** and **Spring Boot Test** for unit and integration tests.
- Example: `CompanyServiceTest.java` verifies CRUD on companies.

Run all tests:

```bash
cd backend
mvn test
```

### Frontend Tests

- Use **Jest** + **React Testing Library** for unit‐testing components.
- Tests live under `frontend/src/__tests__` or adjacent to components with `.test.tsx`.
- Run:

  ```bash
  cd frontend
  yarn test
  # or: npm test
  ```

- For end‐to‐end (E2E) testing, consider adding **Cypress** or **Playwright**. (Not included by default.)

---

## Environment Variables

### Backend (`application.properties` or environment overrides)

| Prop Key                        | Default/Example                        | Description                                  |
| ------------------------------- | -------------------------------------- | -------------------------------------------- |
| `spring.datasource.url`         | `jdbc:postgresql://localhost:5432/crm` | JDBC URL for Postgres                        |
| `spring.datasource.username`    | `crm_user`                             | DB username                                  |
| `spring.datasource.password`    | `secret`                               | DB password                                  |
| `spring.jpa.hibernate.ddl-auto` | `update`                               | `none` / `update` / `create` / `create-drop` |
| `jwt.secret`                    | `VerySecretKeyForJwtSigning1234567890` | Secret key for JWT signing                   |
| `jwt.expiration-ms`             | `86400000`                             | Token validity in milliseconds               |
| `spring.profiles.active`        | `dev` (or `docker` in Docker Compose)  | Active Spring Boot profile                   |
| `spring.security.user.name`     | `admin`                                | Default in-memory user (for testing)         |
| `spring.security.user.password` | `admin`                                | Default in-memory user’s password            |

You can also override in `docker-compose.yml` under the `environment:` block.

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_JWT_COOKIE_NAME=crm_jwt
```

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for all API calls (read by both server & client).
- `NEXT_PUBLIC_JWT_COOKIE_NAME`: Name of the cookie to store JWT for SSR token retrieval.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the Repository**
   Create your own fork, clone it locally, and create a feature branch:

   ```bash
   git clone https://github.com/your-username/uom-crm.git
   cd uom-crm
   git checkout -b feature/your-feature
   ```

2. **Make Changes & Commit**

   - Follow the [project structure](#project-structure).
   - Write meaningful commit messages.
   - Format code according to established style (Maven Checkstyle for Java, Prettier/ESLint for frontend).

3. **Run Tests**

   ```bash
   # Backend
   cd backend
   mvn test

   # Frontend
   cd frontend
   yarn test
   ```

4. **Push & Create Pull Request**

   ```bash
   git push origin feature/your-feature
   ```

   Then open a PR on the main repository. Describe your changes clearly.

5. **Code Review & Approval**

   - Ensure all CI checks pass (linting, tests).
   - Address feedback, squash/rebase if requested.

---

## License

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

Thank you for exploring this CRM project! If you have questions, run into issues, or want to propose new features, please open an issue or pull request. Happy coding!
