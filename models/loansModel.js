import { DataTypes } from "sequelize"; // Sử dụng import thay vì require
import sequelize from "../config/db.js";

const loansModel = sequelize.define(
  "loansModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    book_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
    borrow_date: {
      type: DataTypes.DATE,
    },
    return_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "loans",
    timestamps: false,
  }
);

export default loansModel;
