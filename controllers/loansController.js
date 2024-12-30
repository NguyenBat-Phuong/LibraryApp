import loansModel from "../models/loansModel.js";
import usersModel from "../models/usersModel.js";
import booksModel from "../models/booksModel.js";

export const getAllLoans = async (req, res) => {
  try {
    const loans = await loansModel.findAll();
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm
export const addLoan = async (req, res) => {
  const { user_id, book_id } = req.params;
  if (!user_id || !book_id) {
    return res.status(400).json({
      message: "Vui lòng cung cấp đầy đủ thông tin vào phiếu mượn trả!",
    });
  }
  if (
    isNaN(user_id) ||
    user_id <= 0 ||
    !Number.isInteger(Number(user_id)) ||
    isNaN(book_id) ||
    book_id <= 0 ||
    !Number.isInteger(Number(book_id))
  ) {
    return res
      .status(400)
      .json({ message: "ID người dùng hoặc sách không hợp lệ!" });
  }

  // Tính toán ngày trả
  const borrowDate = new Date(); // Ngày mượn mặc định là ngày hiện tại
  borrowDate.setDate(borrowDate.getDate() + 14);
  const return_date = borrowDate.toISOString();

  try {
    // Tạo phiếu mượn
    const loan = await loansModel.create({
      user_id,
      book_id,
      return_date,
    });

    const user = await usersModel.findByPk(user_id); // Tìm người mượn theo ID
    const book = await booksModel.findByPk(book_id); // Tìm sách mượn theo ID

    if (!user || !book) {
      return res.status(404).json({
        message: "Người mượn hoặc sách không tồn tại!",
      });
    }

    res.status(201).json({
      username: user.username,
      title: book.title,
      message: "Thêm vào thành công!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin sách
export const updateLoan = async (req, res) => {
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

// Xóa
export const deleteLoan = async (req, res) => {
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

    await book.destroy();

    res.json({
      message: `Đã xóa sách với id ${id} thành công!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
