const db = require("@/config/db");
const { DataTypes } = require("sequelize");
const dayjs = require("dayjs");
// 用户表
const User = db.define("user-info", {
  // 昵称
  nickName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 头像
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // 用户唯一标识
  openid: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true, //设为主键，保证唯一性，不能重复
  },
  // 创建时间
  createTime: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: dayjs().format("YYYY-MM-DD: HH:mm:ss"),
  },
});
module.exports = User;
