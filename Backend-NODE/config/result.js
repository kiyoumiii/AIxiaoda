// 统一接口响应数据格式
const responseHandler = async (ctx, next) => {
  ctx.send = (data = null, code = 200, msg = "SUCCESS", error = null, serviceCode = 200) => {
    ctx.body = {
      data, //返给前端的数据
      msg, //提示
      error, //错误说明
      serviceCode, //业务错误码
    };
    ctx.status = code;
  };
  await next();
};
module.exports = responseHandler;
