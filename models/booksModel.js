import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const booksModel = sequelize.define(
  "booksModel",
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
    category: {
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

export default booksModel;
