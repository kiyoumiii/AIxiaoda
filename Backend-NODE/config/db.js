const { Sequelize } = require("sequelize");
const { database, userName, password, host } = require("./default").db;

const db = new Sequelize(database, userName, password, {
  host,
  dialect: "mysql",
  logging: false,
  define: {
    freezeTableName: true, //禁止自动给表名加复数
    timestamps: false,
  },
  sync: {
    //不会强制删除现有表并且重新创建
    force: false,
  },
});
db.sync(); //如果表不存在，就创建表，（如果已经存在，不执行任何操作）
module.exports = db;
