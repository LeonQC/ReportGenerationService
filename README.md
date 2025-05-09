# ReportGenerationService

# 🧱 Report Generation Backend — Microservices Monorepo

A scalable backend architecture built using:

- ⚡️ Fastify for high-performance APIs
- 🧬 Prisma ORM (v7+) with per-service client generation
- 🐘 PostgreSQL via Docker
- 🧰 PNPM Workspaces for dependency and script management
- 🗂 Modular service-based directory structure

---

## 📦 Tech Stack

| Area          | Tool                |
| ------------- | ------------------- |
| Language      | TypeScript          |
| API Framework | Fastify             |
| ORM           | Prisma              |
| Package Mgmt  | PNPM Workspaces     |
| DB            | PostgreSQL (Docker) |
| DB Admin      | pgAdmin (Docker)    |
| Dev Tools     | ts-node-dev         |

---

## 🧪 Useful Commands

| Task                            | Command                                    |
| ------------------------------- | ------------------------------------------ |
| Install dependency to a service | `pnpm add zod -F user-service`             |
| Build all services              | `pnpm -r run build`                        |
| Build a specific service        | `pnpm --filter generate-service run build` |
| Run a service                   | `cd apps/generate-service && pnpm dev`     |
| Migrate DB                      | `pnpm run migrate` (in service dir)        |

## 🔮 Next Steps

-Add Kafka or Redis for async events
-Dockerize each service with its own Dockerfile
-Add /users, /reports APIs with validation and DB access
-Add CI/CD (GitHub Actions or Bitbucket Pipelines)
