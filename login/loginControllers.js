import { usersModel } from "../models/index.js";
import bcrypt from "bcrypt";
import {
  canBorrowBooks,
  canManageBooks,
  canManageUsers,
} from "../controllers/user_permissionsController.js";
import { checkAdminRole } from "../middlewares/checkPermissions.js"; // Import hàm kiểm tra vai trò

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Tìm người dùng trong cơ sở dữ liệu
    const user = await usersModel.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ Error: "Nhập lại tên và mật khẩu" });
    }

    // Kiểm tra mật khẩu
    if (typeof password !== "string") {
      return res.status(400).json({ Error: "Mật khẩu không hợp lệ" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ Error: "Nhập lại tên và mật khẩu" });
    }

    // Kiểm tra quyền người dùng
    const borrowPermission = await canBorrowBooks(user.id);
    const manageBooksPermission = await canManageBooks(user.id);
    const manageUsersPermission = await canManageUsers(user.id);

    // Kiểm tra vai trò của người dùng (kiểm tra admin)
    try {
      await checkAdminRole(user.id); // Kiểm tra vai trò admin
    } catch (error) {
      return res.status(403).json({ Error: error.message }); // Nếu không phải admin, trả lỗi
    }

    // Trả về kết quả đăng nhập và các quyền của người dùng
    res.json({
      message: "Login successful",
      userId: user.id,
      permissions: {
        canBorrowBooks: borrowPermission,
        canManageBooks: manageBooksPermission,
        canManageUsers: manageUsersPermission,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Error: error.message || "Internal server error" });
  }
};
