# Running the Vegan Hive Application

This guide will walk you through the necessary steps to set up and run a Node.js server along with a React application developed using Vite.

## Requirements

- Installed Node.js (version 14 or higher)
- npm (usually installed along with Node.js)
- Docker

## Steps

### 0. Running with Docker (recommended)

1. Create the database, server, and web application with a single command in the root folder:

```bash
docker compose up -d
```

## If you prefer not to use Docker, follow the steps below

### 1. Setting up the Neo4J Database

1. Create the database using a Docker container:

```bash
docker run --restart always --publish=7474:7474 --publish=7687:7687 --env NEO4J_AUTH=neo4j/<password> --volume=/data:/data --volume=/logs:/logs neo4j:5.10.0
```

### 2. Configuring the Node.js Server

1. Navigate to the server directory:

```bash
cd server
npm i
npm run start:dev
```

2. Don't forget to configure the environment variables for your case.

### 3. Configuring ReactJS

1. Navigate to the webapp directory:

```bash
cd webapp
npm i
npm run dev
```

2. Don't forget to configure the environment variables for your case.
