import { usersModel } from "../models/index.js";

export const checkAdminRole = async (userId) => {
  const user = await usersModel.findByPk(userId);
  
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  if (user.role !== 'admin') {
    throw new Error("Bạn không có quyền truy cập");
  }

  return true;
};