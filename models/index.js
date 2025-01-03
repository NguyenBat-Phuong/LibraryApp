import usersModel from "./usersModel.js";
import booksModel from "./booksModel.js";
import loansModel from "./loansModel.js";
import statisticsModel from "./statisticsModel.js";
import userPermissionsModel from "./userPermissionsModel.js";

usersModel.hasMany(loansModel, { foreignKey: "user_id" });
usersModel.hasMany(userPermissionsModel, { foreignKey: "user_id" });

booksModel.hasMany(loansModel, { foreignKey: "book_id" });
booksModel.hasMany(statisticsModel, { foreignKey: "book_id" });

loansModel.belongsTo(usersModel, { foreignKey: "user_id" });
loansModel.belongsTo(booksModel, { foreignKey: "book_id" });

statisticsModel.belongsTo(booksModel, { foreignKey: "book_id" });

userPermissionsModel.belongsTo(usersModel, { foreignKey: "user_id" });


export { usersModel, booksModel, loansModel, statisticsModel , userPermissionsModel };
