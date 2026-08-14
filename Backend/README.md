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

---

## POST /users/login

Description:
- Authenticate a user with email and password. Validates input, compares the provided password with the stored hashed password, and returns a JWT token plus the authenticated user if credentials are valid.

Request:
- Method: `POST`
- URL: `/users/login`
- Content-Type: `application/json`

Body (JSON):
- `email` (string, required) — must be a valid email
- `password` (string, required) — minimum 6 characters

Example Request Body:

```json
{
  "email": "jane.doe@example.com",
  "password": "secret123"
}
```

### Example Response

- `user` (object):
  - `fullname` (object):
    - `firstname` (string): User's first name.
    - `lastname` (string): User's last name.
  - `email` (string): User's email address.
  - `socketId` (string or null): User's socket ID if available.
- `token` (string): JWT Token for authenticated requests

Validation rules (as implemented in `routes/user.routes.js`):
- `email` — `isEmail()`
- `password` — `isLength({ min: 6 })`

Responses:
- `200 OK` — Login successful. Returns JSON `{ token, user }` where `token` is a JWT and `user` is the authenticated user object (password field is not included).
- `400 Bad Request` — Validation failed. Returns `{ errors: [...] }` from `express-validator`.
- `401 Unauthorized` — Invalid email or password. User not found or password does not match.
- `500 Internal Server Error` — Unexpected server error.

Example Responses:

Success (200 OK):

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

Authentication Error (401 Unauthorized):

```json
{
  "message": "Invalid email or password"
}
```

Notes:
- Passwords are compared using `user.comparePassword()` which uses `bcrypt` to securely verify the provided password against the stored hash.
- A JWT is generated with `user.generateAuthToken()`; ensure `JWT_SECRET` is set in environment variables.
- The password field is never returned in the response, even though it's retrieved from the database with `.select("+password")` for comparison.
- Both invalid email and incorrect password return the same generic error message for security reasons.

---

## GET /users/profile

Description:
- Retrieve the authenticated user's profile. Requires a valid JWT token for authentication.

Request:
- Method: `GET`
- URL: `/users/profile`
- Headers:
  - `Authorization: Bearer <token>` (or cookie with `token`)

### Example Response

- `_id` (string): User's unique MongoDB ID.
- `fullname` (object):
  - `firstname` (string): User's first name.
  - `lastname` (string): User's last name.
- `email` (string): User's email address.
- `socketId` (string or null): User's socket ID if available.

Responses:
- `200 OK` — Profile retrieved successfully. Returns the authenticated user object.
- `401 Unauthorized` — Invalid or missing token. Token is blacklisted or expired.
- `500 Internal Server Error` — Unexpected server error.

Example Responses:

Success (200 OK):

```json
{
  "_id": "60c72b2f9b1e8e5f6c8f9d7a",
  "fullname": { "firstname": "Jane", "lastname": "Doe" },
  "email": "jane.doe@example.com",
  "socketId": null
}
```

Unauthorized Error (401 Unauthorized):

```json
{
  "message": "Unauthorized"
}
```

Notes:
- This endpoint requires authentication via the `authUser` middleware.
- The token must be passed either in the `Authorization` header as a Bearer token or in a `token` cookie.
- The password field is never included in the response.

See implementation files:
- [Backend/controllers/user.controller.js](Backend/controllers/user.controller.js)
- [Backend/middlewares/auth.middleware.js](Backend/middlewares/auth.middleware.js)

---

## POST /users/logout

Description:
- Logout an authenticated user. Clears the authentication cookie, blacklists the JWT token, and invalidates the session.

Request:
- Method: `POST`
- URL: `/users/logout`
- Headers:
  - `Authorization: Bearer <token>` (or cookie with `token`)

### Example Response

- `message` (string): Confirmation message.

Responses:
- `200 OK` — Logout successful. Token is blacklisted and user is logged out.
- `401 Unauthorized` — Invalid or missing token. Token is already blacklisted or expired.
- `500 Internal Server Error` — Unexpected server error.

Example Responses:

Success (200 OK):

```json
{
  "message": "Logged out"
}
```

Unauthorized Error (401 Unauthorized):

```json
{
  "message": "Unauthorized"
}
```

Notes:
- This endpoint requires authentication via the `authUser` middleware.
- The token is stored in the blacklist model to prevent reuse after logout.
- The `token` cookie is cleared from the client's browser.
- The token can be passed either in the `Authorization` header as a Bearer token or in a `token` cookie.
- After logout, any requests using the blacklisted token will be rejected by the `authUser` middleware.

See implementation files:
- [Backend/controllers/user.controller.js](Backend/controllers/user.controller.js)
- [Backend/models/blacklistToken.model.js](Backend/models/blacklistToken.model.js)
- [Backend/middlewares/auth.middleware.js](Backend/middlewares/auth.middleware.js)
