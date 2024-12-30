import usersModel from "./usersModel.js";
import booksModel from "./booksModel.js";
import loansModel from "./loansModel.js";

usersModel.hasMany(loansModel, { foreignKey: "user_id" });
booksModel.hasMany(loansModel, { foreignKey: "book_id" });

loansModel.belongsTo(usersModel, { foreignKey: "user_id" });
loansModel.belongsTo(booksModel, { foreignKey: "book_id" });

export { usersModel, booksModel, loansModel };
