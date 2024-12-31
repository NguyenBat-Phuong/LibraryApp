import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserPermissions = sequelize.define("UserPermissions", {
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
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  can_manage_books: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  can_manage_users: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export default UserPermissions;
