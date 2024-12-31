import UserPermissions from "../models/user_permissionsModel.js";

export const canBorrowBooks = async (userId) => {
  const permissions = await UserPermissions.findOne({ where: { user_id: userId } });
  if (!permissions) {
    throw new Error("Người dùng không có quyền");
  }

  return permissions.can_borrow_books;
};

export const canManageBooks = async (userId) => {
  const permissions = await UserPermissions.findOne({ where: { user_id: userId } });
  if (!permissions) {
    throw new Error("Người dùng không có quyền");
  }

  return permissions.can_manage_books;
};

export const canManageUsers = async (userId) => {
  const permissions = await UserPermissions.findOne({ where: { user_id: userId } });
  if (!permissions) {
    throw new Error("Người dùng không có quyền");
  }

  return permissions.can_manage_users;
};
