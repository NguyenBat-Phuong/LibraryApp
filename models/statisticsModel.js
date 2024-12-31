import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const statisticsModel = sequelize.define(
  "statisticsModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
    },
    borrow_count: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: "statistics",
    timestamps: false,
  }
);

export default statisticsModel;
