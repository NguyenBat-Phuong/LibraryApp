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
