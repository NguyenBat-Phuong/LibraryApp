import express from "express";
import booksRoutes from "./routes/book.js";
import usersRoutes from "./routes/user.js";
import loansRoutes from "./routes/loan.js";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

app.use("/loans", loansRoutes);
app.use("/books", booksRoutes);
app.use("/users", usersRoutes);

// Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
