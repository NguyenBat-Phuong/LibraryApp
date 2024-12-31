import { loansModel, booksModel, statisticsModel } from "../models/index.js";
import sequelize from "../config/db.js";

// Tinh tong sach
export const countBooksBorrowed = async (req, res) => {
  try {
    const borrowedBooks = await loansModel.findAll({
      attributes: [
        "book_id",
        [sequelize.fn("COUNT", sequelize.col("book_id")), "borrow_count"],
      ],
      group: ["book_id"],
      include: [
        {
          model: booksModel,
          attributes: ["title"],
          required: true,
        },
      ],
    });

    res.json(borrowedBooks);

    for (const book of borrowedBooks) {
      await statisticsModel.upsert({
        book_id: book.book_id,
        title: book.title,
        borrow_count: book.borrow_count,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật
export const updateBooksBorrowed = async (req, res) => {
  const { borrow_count } = req.body;
  const { book_id, book_title } = req.params;

  if (!book_id && !book_title) {
    return res.status(400).json({ message: "Cần cung cấp ID hoặc tên sách!" });
  }

  if (
    book_id &&
    (isNaN(book_id) || book_id <= 0 || !Number.isInteger(Number(book_id)))
  ) {
    return res
      .status(400)
      .json({ message: "ID sách phải là số nguyên dương!" });
  }

  if (borrow_count && (isNaN(borrow_count) || borrow_count < 0)) {
    return res
      .status(400)
      .json({ message: "Số lần mượn sách phải là một số không âm!" });
  }
  try {
    let statistic = null;
    if (book_id) {
      statistic = await statisticsModel.findByPk(book_id);
    } else if (book_title) {
      statistic = await statisticsModel.findOne({
        where: { title: book_title },
      });
    }

    console.log(statistic);
    if (!statistic) {
      return res.status(404).json({ message: "Sách không tồn tại!" });
    }
    // borrow_count = 0;
    statistic.borrow_count = borrow_count || statistic.borrow_count;
    await statistic.save();

    return res.json({ message: "Cập nhật thành công!" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
