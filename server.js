import express from "express";
import booksRoutes from "./routes/books.js";
import usersRoutes from "./routes/user.js";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/books", booksRoutes);
app.use("/users", usersRoutes);

// Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
