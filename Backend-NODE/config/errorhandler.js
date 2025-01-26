const logger = require("@/loggerMiddleware");
// 捕获错误的中间件
const errorHandler = async (ctx, next) => {
  try {
    await next();
    // logger.info(`输出日志：${ctx.method} ${ctx.url}`);
  } catch (errorData) {
    logger.error(errorData);
    console.log("捕获到错误了");
    // 接收参数校验的错误
    if (errorData.code) {
      const { code, msg, error } = errorData;
      const errorVal = error || null;
      ctx.send(null, code, msg, errorVal);
    } else if (errorData.error) {
      // 智谱ai的错误
      const { message, code } = errorData.error;
      ctx.send(null, 200, "SUCCESS", message, code);
    } else {
      console.log(errorData);
      const error = errorData.message || "异常错误,请查看服务器端日志";
      const status = errorData.status || errorData.statusCode || 500;
      ctx.send(null, status, "服务器端异常错误", error);
    }
  }
};
module.exports = errorHandler;
