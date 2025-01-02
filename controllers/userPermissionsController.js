import userPermissionsModel from "../models/userPermissionsModel.js";

export const checkPermissions = (permissionKey) => {
  return async (req, res, next) => {
    const userId = req.user.id;

    try {
      const userPermissions = await userPermissionsModel.findOne({
        where: { user_id: userId },
      });

      if (!userPermissions) {
        return res.status(404).json({ Error: "Người dùng không có quyền nào" });
      }

      if (userPermissions[permissionKey] === undefined) {
        return res
          .status(400)
          .json({ Error: `Quyền '${permissionKey}' không tồn tại` });
      }

      if (userPermissions[permissionKey] === 0) {
        return res.status(403).json({ Error: "Bạn không có quyền truy cập" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ Error: error.message || "Lỗi hệ thống" });
    }
  };
};
