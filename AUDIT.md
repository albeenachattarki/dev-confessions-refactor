# Pre-Refactor Audit

The starter implementation was intentionally functional but difficult to maintain. The following issues were identified before making changes:

1. `app.js` owns application setup, route declarations, request validation, business logic, in-memory persistence, logging, response formatting, and server startup.
2. `handleAll(req, res, t)` is a monolithic dispatcher with five unrelated responsibilities selected by a string flag. This makes individual behavior difficult to test and changes risky.
3. Variables such as `x`, `d`, `r`, `i`, `arr`, `tmp`, `fn`, `handler`, and `res2` do not communicate what they contain.
4. The allowed confession categories are duplicated in the create and category branches.
5. The delete token is hardcoded in application logic, which is a secret-management and deployment problem.
6. The port is hardcoded to `3000`, preventing configuration in hosted environments.
7. Route handlers contain business logic instead of delegating through a route/controller/service boundary.
8. Validation is deeply nested and returns inconsistent error shapes and messages inherited from the legacy behavior.
9. The in-memory confession collection is accessed directly by every branch, with no service abstraction.
10. The entrypoint starts listening as a side effect of importing the file, which makes integration testing harder.
11. Comments explain very little about the non-obvious constraints, such as preserving reverse-chronological reads and the legacy delete-token contract.
12. There is no documentation of refactoring decisions, no environment template, and no automated endpoint verification.
13. The final `if (confessions.length > 500)` block is unreachable for normal requests and has no operational effect.

The refactor addresses each structural issue while preserving the documented endpoint paths and response behavior.
