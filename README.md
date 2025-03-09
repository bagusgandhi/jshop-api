# JSHOP API

## Overview
JSHOP API built with Fastify, designed to simplify product and stock management. It provides a robust and efficient solution for handling inventory, product listings, and stock updates based on Adjusment Transaction Data.

## Prerequisites
Before setting up the project, ensure you have the following installed:

- **Node.js** v22.14.0
- **NPM** v10.9.2
- **PostgreSQL** (for database management)
- **Docker** (optional, recommended for production deployment)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/bagusgandhi/jshop-api.git
cd jshop-api
```

### 2. Install Dependencies
Once inside the project directory, install the required packages:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file based on `.env.example` and update the necessary values:
```bash
PORT=8093
DATABASE_URL="postgres://user:password@localhost:5432/dbname"
DUMMY_DATA_URL="https://dummyjson.com/products"
```

### 4. Test Database Connection
Ensure the database connection is properly configured by running the following command:
```bash
npx ts-node src/test/dbconn.ts
```

### 5. Run Database Migrations
Once the database connection is successful, apply the migrations to create the necessary tables:
```bash
npm run migrate:up
```

### 6. Start the project
Development Mode
```bash
npm run dev # for development
```
production  Mode
```bash
npm run build
npm run start # for production
```

### 7. Access API Documentation
Once the server is running, you can access the Swagger API documentation at:
```bash
http://localhost:8093/docs
```

## Deployment (Opsional)
For production deployment using Docker, run:
```bash
docker compose up -d --build
```

This will build and start the JSHOP API in a production-ready environment.



