const express = require("express");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/users", require("./routes/users"));
app.use("/books", require("./routes/books"));
// app.use("/loans", require("./routes/loans"));
// app.use("/statistics", require("./routes/statistics"));

// Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
