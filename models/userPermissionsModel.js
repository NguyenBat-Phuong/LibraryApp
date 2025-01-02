import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const userPermissionsModel = sequelize.define(
  "userPermissionsModel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    can_borrow_books: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },
    can_manage_books: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    can_manage_users: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
  },
  {
    tableName: "user_permissions",
    timestamps: false,
  }
);
export default userPermissionsModel;
