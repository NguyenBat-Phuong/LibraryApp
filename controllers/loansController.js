import { loansModel, usersModel, booksModel } from "../models/index.js";

export const getAllLoans = async (req, res) => {
  try {
    const loans = await loansModel.findAll({
      include: [
        {
          model: usersModel,
          attributes: ['username'],
        },
        {
          model: booksModel,
          attributes: ['title'],
        },
      ],
    });
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

// Xóa
export const deleteLoan = async (req, res) => {
  const { username, title } = req.params;

  try {
    let user = null;
    let book = null;

    if (username) {
      user = await usersModel.findOne({ where: { username } });
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại!" });
      }
    }

    if (title) {
      book = await booksModel.findOne({ where: { title } });
      if (!book) {
        return res.status(404).json({ message: "Sách không tồn tại!" });
      }
    }

    // Xóa tất cả phiếu mượn của người dùng
    if (user && !book) {
      const loans = await loansModel.findAll({ where: { user_id: user.id } });
      if (loans.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có phiếu mượn của người dùng này!" });
      }
      await loansModel.destroy({ where: { user_id: user.id } });
      return res.json({
        message: `Đã xóa tất cả phiếu mượn của người dùng ${username} thành công!`,
      });
    }

    // Xóa tất cả phiếu mượn của sách
    if (book && !user) {
      const loans = await loansModel.findAll({ where: { book_id: book.id } });
      if (loans.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có phiếu mượn cho sách này!" });
      }
      await loansModel.destroy({ where: { book_id: book.id } });
      return res.json({
        message: `Đã xóa tất cả phiếu mượn của sách ${title} thành công!`,
      });
    }

    // Xoas username và title
    if (user && book) {
      const loan = await loansModel.findOne({
        where: { user_id: user.id, book_id: book.id },
      });

      if (!loan) {
        return res.status(404).json({
          message: "Không tìm thấy phiếu mượn của người dùng và sách này!",
        });
      }
      await loan.destroy();
      return res.json({
        message: `Đã xóa phiếu mượn của người dùng ${username} cho sách ${title} thành công!`,
      });
    }

    // Nếu không có username hoặc title, trả về lỗi
    return res
      .status(400)
      .json({ message: "Cần cung cấp username hoặc title!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
