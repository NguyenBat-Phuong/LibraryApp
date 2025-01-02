import jwt from "jsonwebtoken";

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return reject(err);
      }
      resolve(user); // Nếu token hợp lệ, trả về thông tin người dùng
    });
  });
};

// module.exports = {verifyToken};
export default verifyToken;