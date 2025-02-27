# How to run

```bash
docker compose up -d
```

The frontend will be available at `http://localhost:8080`
The backend swagger docs are available at `http://localhost:3000/docs`

The admin login:
Email: admin@example.com
Password: adminadmin

# How to dev

## Installation

```bash
corepack enable
yarn install
yarn dev
```

The backend is available at `http://localhost:3000`
The frontend is available at `http://localhost:8080`

## Authentication

Signed JWT token is set in cookie `token` with HttpOnly and SameSite flag. Secure is not set to be able to test locally.

A "refreshToken" cookie is set for refreshing the access token. To refresh the token call `/api/auth/refresh` endpoint.

## Database

A mongodb is set up with docker-compose.
Admin username: root
Password: example

`corum` database is created with a user collection. The user collection will be filled with an admin user and 100 auto generated users to ease the testing and to show the pagination feature.

## Backend

Fastify with following plugins:

- fastify@cookie: JWT Cookie authentication
- fastify@jwt: JWT
- fastify@swagger and fastify@swagger-ui: Swagger documentation
- fastify@mongodb: MongoDB connection
- fastify@awilix: Dependency injection

## Frontend

Stack used:

- React
- Redux Toolkit: state management
- React Router: routing
- mui: Material UI
- styled-components: CSS in JS
- vite: build tool
- yup: schema validation
- react-hook-form: form handling
- nginx: reverse proxy and static file server

In the docker build the webapp is built and served by nginx. The endpoint `/api` is proxied to the backend.

## Monorepo

The project is done with yarn monorepo. The backend and frontend are in the packages workspace.
