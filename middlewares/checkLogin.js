import verifyToken from "./verifyToken.js";

// const {verifyToken} = require('./verifyToken');
export const checkLogin = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ Error: "Bạn cần đăng nhập" });
  }
  const tokenWithoutBearer = token.startsWith("Bearer")
    ? token.slice(7)
    : token;
  verifyToken(tokenWithoutBearer)
    .then((user) => {
      req.user = user;
      next(); 
    })
    .catch(() => {
      res.status(401).json({ Error: "Token không hợp lệ" });
    });
};
