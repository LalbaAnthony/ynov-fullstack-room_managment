# 🚪 - Room management

## 🚀 - Quick start

### Prerequisites
- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if not using Docker)
- npm or yarn
- Git

### Clone the repository

```bash
git clone <repository-url>
cd room-management
```

### Setup the environment

Copy the `.env.example` file to `.env` and fill in the required environment variables.

```bash
cd service-* && cp .env.example .env
```

### In dev

For `service-*/` and `api-gateaway`:

```bash
# Install dependencies
npm i

# Start the server
npm run dev
```

For `frontend`:

```bash
# Install dependencies
npm i

# Start the server
next dev
```

### In production, using Docker

```bash
# Can be used to clean up any previous Docker containers and images
docker-compose down
docker system prune -f

# Build and run the Docker containers
docker-compose up --build
```

## 🧱 - Structure

Ports allocation:
- `frontend/`: port `3000`
- `api-gateway/`: port `4000`
- `service-*/`: ports `7000`, `7001`, etc. (depending on the service)
- service's `pg-admin`: ports `8000`, `8001`, etc. (depending on the service)
- service's `postgre`: ports `9000`, `9001`, etc. (depending on the service)

For example, if you have `service-1` and `service-2`, they will be accessible at:
- `http://localhost:7000` for `service-1`
- `http://localhost:7001` for `service-2`
- `http://localhost:8000` for `pg-admin` of `service-1`
- `http://localhost:8001` for `pg-admin` of `service-2`
- `http://localhost:9000` for `postgre` of `service-1`
- `http://localhost:9001` for `postgre` of `service-2`
- `http://localhost:3000` for the frontend

## 📖 - Technos

- **Frontend**: 
  - `frontend/`: React, Next.js, Tailwind CSS
- **Backend**:
  - `api-gateway/`: Node.js, Express, TypeScript
  - `service-*/`: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **Containerization**: Docker
- **Orchestration**: Docker Compose