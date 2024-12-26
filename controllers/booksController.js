const db = require("../config/db");

// Lấy danh sách sách
exports.getAllBooks = async (req, res) => {
  try {
    const [books] = await db.query("SELECT * FROM books");
    res.json(books);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Thêm sách
exports.addBook = async (req, res) => {
  const { title, author, category, publish_year, status } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO books (title, author, category, year) VALUES (?, ?, ?, ?, ?)",
      [title, author, category, publish_year, status]
    );
    res
      .status(201)
      .json({ id: result[0].insertId, message: "Thêm sách thành công!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Sửa sách
exports.updateBook = async (req, res) => {
  const { title, author, category, publish_year, status } = req.body;
  const { id } = req.params;
  try {
    await db.query(
      "UPDATE books SET title = ?, author = ?,  category = ?, publish_year = ?, status = ? WHERE id = ?",
      [title, author, category, publish_year, status, id]
    );
    res.json({ message: "Cập nhật sách thành công!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// Xóa sách
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM books WHERE id = ?", [id]);
    res.json({ message: "Xóa sách thành công!" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
