const basicAuth = require("basic-auth");
var jwt = require("jsonwebtoken");
const { secretkey } = require("./default").userToken;

const authority = async (ctx, next) => {
  const token = basicAuth(ctx.req);
  if (!token || !token.name) {
    throw { msg: "没有登陆,没有访问权限", code: 401 };
  }
  try {
    var authcode = jwt.verify(token.name, secretkey);
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      throw { msg: "登录过期,重新登陆", code: 401 };
    }
    throw { msg: "没有访问权限", code: 401 };
  }
  ctx.auth = {
    uid: authcode.uid,
  };
  await next();
};

module.exports = authority;
