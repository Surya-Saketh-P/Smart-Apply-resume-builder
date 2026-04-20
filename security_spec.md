# SmartApply Security Specification

## Data Invariants
1. **User Ownership**: Every profile and application document must reside under a path identified by the user's unique ID (`request.auth.uid`).
2. **Access Control**: A user can only access data where the `userId` in the path matches their authenticated state.
3. **Application Structure**: A job application must contain a `matchScore` between 0-100 and a valid status (`Applied`, `Interview`, `Offer`, `Rejected`).
4. **ID Hardening**: Document IDs for applications must follow naming conventions to prevent injection attacks.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Cross-User Profile Read**: Attempting to read `users/attacker_id/profile/data` as `victim_id`.
2. **Cross-User Application Write**: Attempting to write a document to `users/victim_id/applications/bad_app` as `attacker_id`.
3. **Unauthenticated Read**: Attempting to read any application without being signed in.
4. **Invalid Match Score**: Creating an application with `matchScore: 150`.
5. **Invalid Status**: Updating an application with `status: 'Hired'` (not in enum).
6. **Shadow Field Injection**: Writing an application with an extra `isAdmin: true` field.
7. **Long ID Poisoning**: Creating a document with a 2KB string as the document ID.
8. **PII Leakage**: Attempting to list all users' profiles.
9. **Identity Spoofing**: Writing a profile where the `email` field doesn't match the auth token's email (if verification were strictly enforced on email).
10. **State Shortcutting**: Updating a `Rejected` application back to `Applied` (if terminal states were locked).
11. **Resource Exhaustion**: Writing a 2MB string into the `jobDescription` field (Firestore limit is 1MB, but rules should restrict size).
12. **Missing Required Fields**: Creating an application without a `matchScore`.
