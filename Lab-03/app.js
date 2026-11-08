const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = "./books.db";
const PORT = process.env.PORT || 3000;
let db = null;

async function initializeDBAndServer() {
  try {
    db = await sqlite.open({ filename: dbPath, driver: sqlite3.Database });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database Error:", error.message);
    process.exit(1);
  }
}

// GET /books/?search_q=atomic&order_by=title&order=ASC&limit=10&offset=0&min_price=100&max_price=500
app.get("/books/", async (request, response) => {
  try {
    const {
      search_q = "",
      order_by = "id",
      order = "ASC",
      limit = "10",
      offset = "0",
      min_price,
      max_price
    } = request.query;

    const allowedColumns = ["id", "title", "author", "price", "pages"];
    const safeOrderBy = allowedColumns.includes(order_by) ? order_by : "id";
    const safeOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const safeLimit = Math.max(1, Math.min(parseInt(limit, 10) || 10, 100));
    const safeOffset = Math.max(0, parseInt(offset, 10) || 0);

    let query = "SELECT * FROM book WHERE title LIKE ?";
    const params = [`%${search_q}%`];

    if (min_price !== undefined && max_price !== undefined) {
      query += " AND price BETWEEN ? AND ?";
      params.push(Number(min_price), Number(max_price));
    } else if (min_price !== undefined) {
      query += " AND price >= ?";
      params.push(Number(min_price));
    } else if (max_price !== undefined) {
      query += " AND price <= ?";
      params.push(Number(max_price));
    }

    query += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?`;
    params.push(safeLimit, safeOffset);

    const books = await db.all(query, params);
    response.status(200).json(books);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/books/:bookId/", async (request, response) => {
  try {
    const book = await db.get("SELECT * FROM book WHERE id = ?", [request.params.bookId]);
    if (!book) return response.status(404).json({ message: "Book not found" });
    response.status(200).json(book);
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/books/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;
    if (typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof price !== "number" || !Number.isFinite(price) ||
        (pages !== undefined && (!Number.isInteger(pages) || pages <= 0)) ||
        price < 0) {
      return response.status(400).json({ message: "title, author and a valid numeric price are required" });
    }

    const result = await db.run(
      "INSERT INTO book (title, author, price, pages) VALUES (?, ?, ?, ?)",
      [title.trim(), author.trim(), price, pages || 1]
    );
    response.status(201).json({ message: "Book added successfully", bookId: result.lastID });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/books/:bookId/", async (request, response) => {
  try {
    const { title, author, price, pages } = request.body;
    if (typeof title !== "string" || !title.trim() ||
        typeof author !== "string" || !author.trim() ||
        typeof price !== "number" || !Number.isFinite(price) || price < 0 ||
        !Number.isInteger(pages) || pages <= 0) {
      return response.status(400).json({ message: "Invalid book details" });
    }

    const result = await db.run(
      "UPDATE book SET title = ?, author = ?, price = ?, pages = ? WHERE id = ?",
      [title.trim(), author.trim(), price, pages, request.params.bookId]
    );
    if (result.changes === 0) return response.status(404).json({ message: "Book not found" });
    response.status(200).json({ message: "Book updated successfully" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/books/:bookId/", async (request, response) => {
  try {
    const result = await db.run("DELETE FROM book WHERE id = ?", [request.params.bookId]);
    if (result.changes === 0) return response.status(404).json({ message: "Book not found" });
    response.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    response.status(500).json({ message: "Internal Server Error" });
  }
});

initializeDBAndServer();
