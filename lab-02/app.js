
const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "books.db");
let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await sqlite.open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error(`Database Error: ${error.message}`);
        process.exit(1);
    }
};

// GET: Retrieve all books
app.get("/books/", async (request, response) => {
    try {
        const books = await db.all("SELECT * FROM book");
        response.status(200).send(books);
    } catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// GET: Retrieve a book by ID
app.get("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const book = await db.get(
            "SELECT * FROM book WHERE id = ?",
            [bookId]
        );

        if (book === undefined) {
            response.status(404).send("Book not found");
        } else {
            response.status(200).send(book);
        }
    } catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// POST: Add a new book
app.post("/books/", async (request, response) => {
    try {
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof author !== "string" ||
            !author.trim() ||
            !Number.isInteger(price) ||
            !Number.isInteger(pages) ||
            price < 0 ||
            pages <= 0
        ) {
            return response.status(400).send("Invalid book details");
        }

        const query = `
            INSERT INTO book (title, author, price, pages)
            VALUES (?, ?, ?, ?);
        `;

        const result = await db.run(query, [
            title.trim(),
            author.trim(),
            price,
            pages
        ]);

        response.status(201).send({
            message: "Book added successfully",
            bookId: result.lastID
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// PUT: Update a book by ID
app.put("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;
        const { title, author, price, pages } = request.body;

        if (
            typeof title !== "string" ||
            !title.trim() ||
            typeof author !== "string" ||
            !author.trim() ||
            !Number.isInteger(price) ||
            !Number.isInteger(pages) ||
            price < 0 ||
            pages <= 0
        ) {
            return response.status(400).send("Invalid book details");
        }

        const query = `
            UPDATE book
            SET title = ?, author = ?, price = ?, pages = ?
            WHERE id = ?;
        `;

        const result = await db.run(query, [
            title.trim(),
            author.trim(),
            price,
            pages,
            bookId
        ]);

        if (result.changes === 0) {
            response.status(404).send("Book not found");
        } else {
            response.status(200).send("Book updated successfully");
        }
    } catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

// DELETE: Remove a book by ID
app.delete("/books/:bookId/", async (request, response) => {
    try {
        const { bookId } = request.params;

        const result = await db.run(
            "DELETE FROM book WHERE id = ?",
            [bookId]
        );

        if (result.changes === 0) {
            response.status(404).send("Book not found");
        } else {
            response.status(200).send("Book deleted successfully");
        }
    } catch (error) {
        console.error(error.message);
        response.status(500).send("Internal Server Error");
    }
});

initializeDBAndServer();
