# Technical Architecture: Nexus Pro

## Backend: Clean Architecture (Hexagonal)

### 1. Core Layer (Entities & Use Cases)
- Contains business logic.
- Independent of frameworks (GraphQL, Express) and Database.
- Example: `Task`, `Project`, `User` entities.

### 2. Infrastructure Layer
- **Repository Implementations**: `MongoTaskRepository`, `PostgresTaskRepository`.
- **External Services**: `Auth0Service`, `EmailService`.
- **Database Agnostic Adapter**: A factory pattern to switch between database implementations via environment variables.

### 3. Interface Layer (GraphQL)
- **Resolvers**: Map GraphQL requests to Use Cases.
- **Schema**: Type definitions (SDL).
- **Subscriptions**: Real-time layer using Apollo/Yoga Subscriptions.

## Database Agnostic Strategy
We will use a `Repository` interface:
```typescript
interface ITaskRepository {
  getById(id: string): Promise<Task>;
  save(task: Task): Promise<Task>;
  // ...
}
```
Switching from MongoDB to Postgres will only require creating a new class that implements `ITaskRepository`.

## Frontend: Apollo + React
- **State Management**: Apollo Client Cache (replaces most `useState`/`useEffect`).
- **Real-time**: `useSubscription` for notifications and board updates.
- **UI**: Headless UI + Tailwind for a "Premium" feel.

## Scalability
- **Horizontal Scaling**: Stateless GraphQL servers.
- **Database**: Optimized for the chosen adapter.
- **Pub/Sub**: Redis for scaling GraphQL Subscriptions across multiple server instances.
