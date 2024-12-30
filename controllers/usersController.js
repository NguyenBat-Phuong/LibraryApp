import userModel from "../models/usersModel.js";

// Lấy tất cả
export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.findAll(); // Lấy người dùng từ database
    res.json(users); // Trả về danh sách người dùng dưới dạng JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm
export const addUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  if (!username || !email || !password || role) {
    return res
      .status(400)
      .json({ message: "Vui lòng cung cấp đầy đủ thông tin người dùng!" });
  }

  const validRoles = ["user", "admin"];
  let finalRole = "user";
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid user role" });
  }
  if (role && validRoles.includes(role)) {
    finalRole = role;
  }

  try {
    const user = await userModel.create({
      username,
      email,
      role: finalRole, //finalRole
    });

    res
      .status(201)
      .json({ id: user.id, message: "Thêm người dùng thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin
export const updateUser = async (req, res) => {
  const { username, password, email, role } = req.body;
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0 || !Number.isInteger(Number(id))) {
    return res
      .status(400)
      .json({ message: "ID người dùng phải là số nguyên dương!" });
  }

  const validRoles = ["user", "admin"];
  const finalRole = validRoles.includes(role) ? role : "user";

  try {
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    user.username = username || user.username;
    user.password = password || user.password;
    user.email = email || user.email;
    user.role = finalRole;

    await user.save();

    res.json({ message: "Cập nhật người dùng thành công!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id) || id <= 0 || !Number.isInteger(Number(id))) {
    return res
      .status(400)
      .json({ message: "ID người dùng phải là số nguyên dương!" });
  }

  try {
    const user = await userModel.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    await user.destroy();

    res.json({
      message: `Đã xóa người dùng với id ${id} thành công!`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
