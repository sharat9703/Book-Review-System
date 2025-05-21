# Book Review System

## Project Structure
```
/models
  user.js
  book.js
  review.js
/routes
  auth.js
  books.js
  reviews.js
  search.js
/middleware
  auth.js
index.js
.env.example
```

## Setup Instructions
1. Clone the repo and install dependencies:
   ```bash
   npm install
   npm install bcryptjs jsonwebtoken
   ```
2. configure .env file
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/signup` – Register a new user
- `POST /api/login` – Authenticate and get JWT
- `POST /api/books` – Add a new book (auth required)
- `GET /api/books` – List books (pagination, filter by author/genre)
- `GET /api/books/:id` – Book details, average rating, paginated reviews
- `POST /api/books/:id/reviews` – Add review (auth, one per user per book)
- `PUT /api/reviews/:id` – Update your review
- `DELETE /api/reviews/:id` – Delete your review
- `GET /api/search?query=...` – Search books by title/author

## Example Requests
```
POST /api/signup
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}

POST /api/login
{
  "email": "alice@example.com",
  "password": "password123"
}

POST /api/books (with Bearer token)
{
  "title": "Book Title",
  "author": "Author Name",
  "genre": "Fiction",
  "description": "A great book."
}
```
Please refer the postman collection attached to test the APIs

## Database Schema
- **User**: username, email, password (hashed), createdAt
- **Book**: title, author, genre, description, createdBy, createdAt
- **Review**: book (ref), user (ref), rating, comment, createdAt

---

**Design decisions and assumptions:**
- One review per user per book (enforced by schema index)
- JWT used for stateless authentication
- Passwords are hashed with bcrypt
- Pagination defaults: 10 for books, 5 for reviews
- All endpoints return JSON
