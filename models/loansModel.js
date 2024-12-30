import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const loansModel = sequelize.define(
  "loansModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    book_id: {
      type: DataTypes.INTEGER,
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
