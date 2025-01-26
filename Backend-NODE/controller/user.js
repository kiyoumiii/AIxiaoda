const Validate = require("@/validate/index");
const User = require("@/model/user");
const UserService = require("@/service/user");
const generateToken = require("@/config/jwt");
class UserController {
  // 用户登录
  async wxLogin(ctx) {
    const { nickName, avatar, code } = ctx.request.body;
    await Validate.nullCheck(nickName, "请输入昵称", "nickName");
    await Validate.nullCheck(avatar, "请上传头像", "avatar");
    await Validate.nullCheck(code, "缺少code", "code");
    // 获取openid
    const openid = await new UserService().getOpenid(code);
    // 查询数据库是否已存在用户信息，存在就返回用户数据，不存在就存储
    const userInfo = await User.findOne({ where: { openid } });
    if (!userInfo) {
      await User.create({ nickName, avatar, openid });
    }
    ctx.send({ token: generateToken(openid), nickName, avatar });
  }
}
module.exports = new UserController();
