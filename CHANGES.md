# Refactoring Changes

## Variable Renames

| Old name | New name | Why |
|---|---|---|
| `app` declared with `var` | `app` declared with `const` | The application reference is never reassigned, so immutable declaration communicates intent. |
| `x` | `nextConfessionId` | It is a counter for the next confession identifier. |
| `d` | `confessionData` | The name identifies the request body and its contents. |
| `r` | `requestParams` | The value contains route parameters from the request. |
| `i` | `confessionId` | The parsed value identifies one confession. |
| `arr` | `sortedConfessions` | The collection contains confessions ordered newest first. |
| `result` | `listResponse` | The object is the response envelope for the list endpoint. |
| `info` | `confession` | The value is one stored confession. |
| `cat` | `category` | The name describes the requested confession category. |
| `cats` | `allowedCategories` | The array is the single source of truth for valid categories. |
| `stuff` | `categoryConfessions` | The array contains confessions belonging to one category. |
| `handler` | `confessionIndex` | The value is an array index, not a handler function. |
| `res2` | `deletedConfessions` | The splice result contains the deleted confession record(s). |
| `tmp` | `confession` | The object is the record being persisted and returned. |
| `fn` | `confession` | The callback iterates over confession records. |

## Function Splits

### `handleAll()` split into:

- `validateConfessionInput()` validates required fields and category constraints before persistence.
- `saveConfession()` creates and stores one confession.
- `formatConfessionResponse()` preserves the legacy integrity check and response shape for one confession.
- `listConfessions()` returns the collection in reverse-chronological order.
- `findConfessionById()` isolates lookup behavior.
- `listConfessionsByCategory()` isolates category filtering.
- `deleteConfessionById()` isolates deletion.

The original function mixed validation, persistence, sorting, lookup, filtering, deletion, authorization, logging, and HTTP responses. Controllers now coordinate HTTP concerns, services own business logic, and routes delegate immediately.

## Configuration and Structure

- Moved the port and delete token to environment variables, with `.env.example` documenting the required values.
- Added `dotenv` loading in the application entrypoint.
- Added `routes/`, `controllers/`, and `services/` directories.
- Exported the Express app while keeping `listen()` behind the main-module check so endpoint tests can import the app without opening a server.
- Preserved the existing endpoint paths, status codes, response bodies, category order, and delete-token contract.
- Removed the unreachable collection-size check from the entrypoint because it had no effect on application behavior.
