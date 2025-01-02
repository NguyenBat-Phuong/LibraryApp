import { userPermissionsModel } from "../models/index.js";

export const checkPermissions = (permission) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    try {
      const userPermissions = await userPermissionsModel.findOne({
        where: { user_id: userId },
      });
      if (req.user.role === "admin") {
        return next();
      }
      if (!userPermissions || !userPermissions[permission]) {
        return res.status(403).json({ Error: "Bạn không có quyền truy cập" });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: error.message || "Lỗi hệ thống" });
    }
  };
};
