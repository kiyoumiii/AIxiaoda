module.exports = {
  // mysql账号
  db: {
    database: "mysql数据库名称",
    userName: "用户名",
    password: "密码",
    host: "localhost",
  },
  // 小程序相关的账号
  weiixn: {
    appid: "小程序appid",
    secret: "小程序密钥",
    code2session: "https://api.weixin.qq.com/sns/jscode2session",
  },
  // 智谱清言
  zhipu: {
    apiKey: "智谱ai账号",
  },
  // 阿里云
  aliyun: {
    accessKeyID: "阿里云keyid",
    accessKeySecret: "阿里云keysecret",
  },
  // 登录token签名和有效期
  userToken: {
    secretkey: "dhvgdfytrytuui687990",
    expiresIn: 60 * 60 * 24 * 100,
  },
};
