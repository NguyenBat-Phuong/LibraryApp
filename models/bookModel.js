import { Sequelize, DataTypes } from "sequelize"; // Sử dụng import thay vì require
import sequelize from "../config/db.js"; // Sử dụng import cho sequelize

const bookModel = sequelize.define(
  "bookModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
    },
    publish_year: {
      type: DataTypes.INTEGER,
    },
    book_status: {
      type: DataTypes.ENUM("available", "borrowed", "broken"),
      defaultValue: "available",
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

export default bookModel;
