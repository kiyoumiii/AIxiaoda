var RPCClient = require("@alicloud/pop-core").RPCClient;
const { accessKeyID, accessKeySecret } = require("@/config/default").aliyun;
const dayjs = require("dayjs");
var client = new RPCClient({
  accessKeyId: accessKeyID,
  accessKeySecret: accessKeySecret,
  endpoint: "http://nls-meta.cn-shanghai.aliyuncs.com",
  apiVersion: "2019-02-28",
});

// 获取阿里云的token
class VoiceController {
  async aliToken(ctx) {
    // 判断token是否存在
    const alitoken = await ctx.redis.get("aliToken");
    if (alitoken) {
      ctx.send(alitoken);
      return false;
    }
    const result = await client.request("CreateToken");
    console.log(result);
    if (result.Token && result.Token.Id) {
      // 获取过期时间
      const expires_in = result.Token.ExpireTime - dayjs().unix();
      await ctx.redis.set("aliToken", result.Token.Id, "EX", expires_in);
      ctx.send(result.Token.Id);
    } else {
      ctx.send(null, 500, "获取阿里云token失败", result);
    }
  }
}

module.exports = new VoiceController();
