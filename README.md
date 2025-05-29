# GraphQL Apollo Server

This project is a GraphQL API built with Apollo Server. It uses modular type definitions and resolvers, with a mock database loader that can later be replaced with a NoSQL database.

## Prerequisites

- Node.js (v14 or above)
- npm

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies:

   ```sh
   npm install
   ```

## Running the Application

Compile and start the server with:

```sh
npm start
```

The server will run at [http://localhost:4000](http://localhost:4000).

## Project Structure

- `src/index.ts` - Entry point of the application.
- `src/graphql/typeDefs/` - GraphQL schema definitions.
- `src/graphql/resolvers/` - Resolver functions.
- `src/loaders/db.loader.ts` - Database loader (mock data).

## Containerization

This project includes Dockerfile for containerization with minimalist Linux distribution (minimus)

## License

MIT License.
