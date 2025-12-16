## Backend Testing Strategy

Due to the project using TypeScript with native ES Modules (`"type": "module"`),
setting up Jest required significant tooling overhead (ESM + ts-jest interop).

Given the time constraints of the assignment, I focused on:

- Clean service-layer separation (TaskService)
- Deterministic business logic (no side effects)
- Manual verification via Postman for all critical flows

### Intended Unit Tests
If extended, the following service-layer tests would be implemented using Jest with mocked Prisma:

1. TaskService.createTask
   - creates task successfully for valid input
   - throws error if assigned user does not exist
   - ensures dueDate string is converted to Date

All database interactions are isolated via Prisma and can be easily mocked.

This approach prioritizes architecture clarity and correctness over tooling complexity.
