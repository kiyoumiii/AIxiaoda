const Koa = require("koa");
const app = new Koa();
const json = require("koa-json"); //将http响应的数据转换为json格式
const bodyParser = require("koa-bodyparser"); //解析http请求的消息体
const cors = require("@koa/cors");
const { addAliases } = require("module-alias");
const KoaRedis = require("ioredis");
addAliases({
  "@": __dirname,
});
// 接口
const router = require("@/router");
// 统一接口响应数据格式:中间件
const responseHandler = require("@/config/result");
// 捕获错误中间件
const errorHandler = require("@/config/errorhandler");
app.use(json());
app.use(bodyParser());
app.use(cors());
app.use(responseHandler);
app.use(errorHandler);
// 链接redis
const redisClient = new KoaRedis({
  port: 6379,
  host: "127.0.0.1",
});
// 将redis注册进中间件
app.use(async (ctx, next) => {
  ctx.redis = redisClient;
  await next();
});
app.use(router.routes()).use(router.allowedMethods());
app.listen(7000);
console.log("7000端口已启动！!");
