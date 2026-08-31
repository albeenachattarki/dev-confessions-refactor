# Dev Confessions

An anonymous confession app for developers to share their bugs, deadline stress, imposter syndrome, and vibe-coding sessions.

## Refactored Architecture

The application now follows a small MVC-style separation of concerns. `routes/` receives HTTP requests and delegates immediately, `controllers/` handles request and response coordination, and `services/` contains validation, persistence, filtering, lookup, formatting, and deletion logic.

## Endpoints

- `GET /api/v1/confessions`
- `POST /api/v1/confessions`
- `GET /api/v1/confessions/:id`
- `GET /api/v1/confessions/category/:cat`
- `DELETE /api/v1/confessions/:id` (requires the `x-delete-token` header)

## Configuration

Copy `.env.example` to `.env` and set `PORT` and `DELETE_TOKEN`. The application uses `PORT` for hosted environments and never stores the delete token in source code.

## Run and Test

```bash
npm install
npm start
```

Run the regression suite with:

```bash
npm test
```

## Live Deployment

A temporary live verification URL is available at [https://3020-i587ljilekfq9rg7n5e69-a7b3c11e.sg2.manus.computer](https://3020-i587ljilekfq9rg7n5e69-a7b3c11e.sg2.manus.computer). It is intended for review during this task and may expire when the sandbox session ends.

## Refactoring Record

- [AUDIT.md](./AUDIT.md) lists the issues identified before implementation.
- [CHANGES.md](./CHANGES.md) records variable renames, function splits, structural decisions, and compatibility guarantees.
