var jwt = require("jsonwebtoken");
const { secretkey, expiresIn } = require("./default").userToken;
// 生成token
function generateToken(uid) {
  return jwt.sign({ uid }, secretkey, { expiresIn });
}

module.exports = generateToken;
