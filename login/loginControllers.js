import { usersModel, userPermissionsModel } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const postLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await usersModel.findOne({ where: { username } });
    if (!user) {
      return res
        .status(401)
        .json({ Error: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    if (typeof password !== "string") {
      return res.status(400).json({ Error: "Mật khẩu không hợp lệ" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ Error: "Tên đăng nhập hoặc mật khẩu không đúng" });
    }

    let userPermissions = await userPermissionsModel.findOne({
      where: { user_id: user.id },
    });

    if (!userPermissions) {
      // Tạo quyền mặc định nếu không tìm thấy
      userPermissions = await userPermissionsModel.create({
        user_id: user.id,
        can_borrow_books: 1,
        can_manage_books: 0,
        can_manage_users: 0,
      });
    }

    // token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Trả về phản hồi bao gồm token và quyền
    res.json({
      message: "Login successful",
      token,
      userId: user.id,
      permissions: {
        canBorrowBooks: userPermissions.can_borrow_books,
        canManageBooks: userPermissions.can_manage_books,
        canManageUsers: userPermissions.can_manage_users,
      },
    });
  } catch (error) {
    res.status(500).json({ Error: error.message || "Internal server error" });
  }
};
