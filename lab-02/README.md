# Lab 2: SQLite Database and CRUD Routes

**Subject:** Backend Development Fundamentals  
**Student Name:** K. Bhargava Sai  
**Registration Number:** 252U1R9055  
**Section:** CSE - GEN-AI - 2A-304  
**Year/Term:** Year II, Term II  
**Faculty:** Joel Prashanth D.

## 1. Objective

To connect an Express.js server to an SQLite database and implement CRUD operations through HTTP API endpoints.

CRUD stands for:
- **Create:** Add a new book.
- **Read:** Retrieve book details.
- **Update:** Modify existing book details.
- **Delete:** Remove a book from the database.

## 2. Technologies Used

- Node.js
- Express.js
- SQLite
- sqlite
- sqlite3
- nodemon

## 3. Project Structure

```text
lab-02/
├── app.js
├── books.db
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
└── screenshots/
```

## 4. Database Details

**Database file:** `books.db`  
**Table name:** `book`

| Column | Data type | Description |
|---|---|---|
| id | INTEGER | Primary key |
| title | TEXT | Book title |
| author | TEXT | Author name |
| price | INTEGER | Book price |
| pages | INTEGER | Number of pages |

The database initially contains 10 sample book records.

## 5. Installation

Install the project dependencies by running:

```bash
npm install
```

## 6. Running the Application

Start the server in development mode using nodemon:

```bash
npm run dev
```

To start the server normally:

```bash
npm start
```

**Local server URL:** `http://localhost:3000`

The server starts after the SQLite database connection is established successfully.

## 7. API Endpoints

| HTTP Method | Endpoint | Description | Expected success status |
|---|---|---|---|
| GET | `/books/` | Retrieve all books | 200 OK |
| GET | `/books/:bookId/` | Retrieve a book by ID | 200 OK |
| POST | `/books/` | Add a new book | 201 Created |
| PUT | `/books/:bookId/` | Update a book by ID | 200 OK |
| DELETE | `/books/:bookId/` | Delete a book by ID | 200 OK |

### GET `/books/`

Retrieves all books from the database.

### GET `/books/:bookId/`

Retrieves a particular book using its ID. Returns `404 Not Found` if the book does not exist.

### POST `/books/`

Adds a new book to the database.

Example request body:

```json
{
  "title": "JavaScript Basics",
  "author": "John Smith",
  "price": 350,
  "pages": 250
}
```

Returns `201 Created` when a book is added successfully.

### PUT `/books/:bookId/`

Updates the title, author, price, and pages of an existing book.

Example request body:

```json
{
  "title": "Node.js Advanced",
  "author": "John Smith",
  "price": 400,
  "pages": 250
}
```

Returns `404 Not Found` if the specified book does not exist.

### DELETE `/books/:bookId/`

Deletes a book using its ID. Returns `404 Not Found` if the specified book does not exist.

## 8. Security and Error Handling

- Parameterized SQL queries use `?` placeholders to safely pass user input.
- `try...catch` blocks handle database and route errors.
- HTTP `400` is returned for invalid book details.
- HTTP `404` is returned when a requested book is not found.
- HTTP `500` is returned for internal server errors.
- The SQLite database file is included in the project.

## 9. Testing

The five API endpoints have been tested locally using PowerShell HTTP requests.

- GET all books: Tested successfully.
- GET a book by ID: Tested successfully.
- POST a new book: Tested successfully.
- PUT an existing book: Tested successfully.
- DELETE a book: Tested successfully.

The database was checked after inserting and deleting a book to verify that the changes were persisted.

## 10. Screenshots

Screenshots of the API requests and responses will be stored in the `screenshots/` folder.

Add screenshot links here after saving the images:

- GET all books
- GET a book by ID
- POST a book
- PUT a book
- DELETE a book

## 11. Environment Variables

No environment variables are currently required for this local project.

## 12. Deployment

**Live URL:** Pending deployment.

The application will be deployed to a supported hosting platform, and the live URL will be added here after successful deployment.
