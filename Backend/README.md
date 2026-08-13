# Users API Documentation

## POST /users/register

Description:
- Register a new user. Validates input, hashes the password, saves the user, and returns a JWT token plus the created user (password excluded).

Request:
- Method: `POST`
- URL: `/users/register`
- Content-Type: `application/json`

Body (JSON):
- `fullname` (object)
  - `firstname` (string, required) — minimum 3 characters
  - `lastname` (string, optional) — minimum 3 characters if provided
- `email` (string, required) — must be a valid email
- `password` (string, required) — minimum 6 characters

Example Request Body:

```json
{
  "fullname": { "firstname": "Jane", "lastname": "Doe" },
  "email": "jane.doe@example.com",
  "password": "secret123"
}
```

### Example Response

- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name (minimum 3 characters).
    - `lastname` (string): User's last name (minimum 3 characters).
  - `email` (string): User's email address (must be a valid email).
  - `password` (string): User's password (minimum 6 characters).
- `token` (string): JWT Token

Validation rules (as implemented in `routes/user.routes.js`):
- `email` — `isEmail()`
- `fullname.firstname` — `isLength({ min: 3 })`
- `password` — `isLength({ min: 6 })`

Responses:
- `201 Created` — Registration successful. Returns JSON `{ token, user }` where `token` is a JWT and `user` is the created user object (the `password` field is not returned).
- `400 Bad Request` — Validation failed. Returns `{ errors: [...] }` from `express-validator`.
- `409 Conflict` — Email already exists (possible from unique index error).
- `500 Internal Server Error` — Unexpected server error.

Example Responses:

Success (201 Created):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60c72b2f9b1e8e5f6c8f9d7a",
    "fullname": { "firstname": "Jane", "lastname": "Doe" },
    "email": "jane.doe@example.com",
    "socketId": null
  }
}
```

Validation Error (400 Bad Request):

```json
{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" },
    { "msg": "Password must be at least 6 characters long", "param": "password", "location": "body" }
  ]
}
```

Notes:
- Passwords are hashed using `bcrypt` via `user.model.js` before storing.
- A JWT is generated with `user.generateAuthToken()`; ensure `JWT_SECRET` is set in environment variables.
- The saved user model excludes the `password` field from query results (`select: false`).

See implementation files:
- [Backend/routes/user.routes.js](Backend/routes/user.routes.js)
- [Backend/controllers/user.controller.js](Backend/controllers/user.controller.js)
- [Backend/models/user.model.js](Backend/models/user.model.js)
