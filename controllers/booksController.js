import { booksModel, statisticsModel, loansModel } from "../models/index.js";
import sequelize from "../config/db.js";

// Lấy tất cả sách
export const getAllBooks = async (req, res) => {
  try {
    const books = await booksModel.findAll();
    return res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm sách
export const addBook = async (req, res) => {
  const { title, author, category, publish_year, book_status } = req.body;

  if (!title || !author || !category || !publish_year) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp đầy đủ thông tin sách!" });
  }

  const validStatuses = ["available", "borrowed", "broken"];
  let finalStatus = "available";

  if (book_status && !validStatuses.includes(book_status)) {
    return res.status(400).json({ message: "Trạng thái sách không hợp lệ!" });
  }

  if (book_status && validStatuses.includes(book_status)) {
    finalStatus = book_status;
  }

  const transaction = await sequelize.transaction();
  try {
    // Thêm bản ghi vào bảng books
    const book = await booksModel.create(
      {
        title,
        author,
        category,
        publish_year,
        book_status: finalStatus,
      },
      { transaction }
    );

    // Thêm bản ghi vào bảng statistics
    await statisticsModel.create(
      {
        book_id: book.id,
        borrow_count: 0,
      },
      { transaction }
    );
    await transaction.commit();

    res
      .status(201)
      .json({ id: book.id, message: "Thêm sách và thống kê thành công!" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ error: "Lỗi hệ thống: " + err.message });
  }
};

// Cập nhật thông tin sách
export const updateBook = async (req, res) => {
  const { title, author, category, publish_year, book_status } = req.body;
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0 || !Number.isInteger(Number(id))) {
    return res
      .status(400)
      .json({ message: "ID sách phải là số nguyên dương!" });
  }

  const validStatus = ["available", "borrowed", "broken"];
  const finalStatus = validStatus.includes(book_status)
    ? book_status
    : "available";

  try {
    const book = await booksModel.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: "Sách không tồn tại!" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.publish_year = publish_year || book.publish_year;
    book.book_status = finalStatus;

    await book.save();

    res.json({ message: "Cập nhật sách thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa sách
export const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0 || !Number.isInteger(Number(id))) {
    return res
      .status(400)
      .json({ message: "ID sách phải là số nguyên dương!" });
  }

  try {
    const book = await booksModel.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: "Sách không tồn tại!" });
    }

    if (book.book_status !== "available" && book.book_status !== "broken") {
      return res
        .status(400)
        .json({ message: "Không thể xóa sách vì sách đang được mượn!" });
    }

    await statisticsModel.destroy({
      where: { book_id: id },
    });

    await loansModel.destroy({
      where: { book_id: id },
    });

    await book.destroy();

    res.json({
      message: `Đã xóa sách với id ${id} thành công và xoa các phieu muon tra!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
