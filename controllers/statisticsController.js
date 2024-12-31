import { loansModel, booksModel, statisticsModel } from "../models/index.js";
import sequelize from "../config/db.js";

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

    for (const book of borrowedBooks) {
      const { book_id, borrow_count } = book.dataValues;
      const title = book.booksModel?.title;
      const existingBook = await statisticsModel.findOne({
        where: { id: book_id },
      });
      if (!existingBook) {
        await statisticsModel.create({
          id: book_id,
          book_id,
          title,
          borrow_count,
        });
      } else {
        const count =
          parseInt(existingBook.borrow_count, 10) - parseInt(borrow_count, 10);
        existingBook.borrow_count += count;
        await existingBook.save();
      }
    }

    res.json(borrowedBooks);
  } catch (error) {
    console.error("Error processing borrowed books:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing borrowed books." });
  }
};

// Cập nhật
// export const updateBooksBorrowed = async (req, res) => {
//   const { borrow_count } = req.body;
//   const { book_id, title } = req.params;

//   if (!book_id && !title) {
//     return res.status(400).json({ message: "Cần cung cấp ID hoặc tên sách!" });
//   }

//   if (
//     book_id &&
//     (isNaN(book_id) || book_id <= 0 || !Number.isInteger(Number(book_id)))
//   ) {
//     return res
//       .status(400)
//       .json({ message: "ID sách phải là số nguyên dương!" });
//   }

//   if (borrow_count === undefined) {
//     return res
//       .status(400)
//       .json({ message: "Cần cung cấp số lần mượn sách hợp lệ!" });
//   }

//   if (borrow_count && (isNaN(borrow_count) || borrow_count < 0)) {
//     return res
//       .status(400)
//       .json({ message: "Số lần mượn sách phải là một số không âm!" });
//   }
//   try {
//     let statistic = null;
//     if (book_id) {
//       statistic = await statisticsModel.findByPk(book_id);
//     } else if (title) {
//       statistic = await statisticsModel.findOne({
//         where: { title: title },
//       });
//     }

//     console.log(statistic);
//     if (!statistic) {
//       return res.status(404).json({ message: "Sách không tồn tại!" });
//     }
//     statistic.borrow_count = borrow_count || statistic.borrow_count;
//     await statistic.save();

//     return res.json({ message: "Cập nhật thành công!" });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };
