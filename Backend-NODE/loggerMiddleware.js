const log4js = require("log4js");
// 将自定义的日志级别与log4js模块中的相应级别进行映射
const levels = {
  trace: log4js.levels.TRACE,
  debug: log4js.levels.DEBUG,
  info: log4js.levels.INFO,
  warn: log4js.levels.WARN,
  error: log4js.levels.ERROR,
  fatal: log4js.levels.FATAL,
};
// 对log4js进行配置
log4js.configure({
  appenders: {
    // 输出日志到控制台
    console: { type: "console" },
    // 将info级别的日志输出到名为info-logs.log的文件中
    info: {
      type: "file",
      filename: "logs/info-logs.log",
    },
	// 将error级别的日志按日期输出到名为error-yyyy-MM-dd.log的文件中，
    error: {
      type: "dateFile",
      filename: "logs/error",
      pattern: "yyyy-MM-dd.log",
      // 设置文件名称是 filename + pattern
      alwaysIncludePattern: true,
    },
  },
  // 定义了不同的日志分类及其配置,不同级别日志的输出到不同的目标
  categories: {
	// 默认分类，将日志输出到控制台，日志级别为debug
    default: { appenders: ["console"], level: "debug" },
	// 将info级别的日志同时输出到文件和控制台，日志级别为info
    info: {
      appenders: ["info", "console"],
      level: "info",
    },
	// 将error级别的日志同时输出到文件和控制台，日志级别为error
    error: {
      appenders: ["error", "console"],
      level: "error",
    },
  },
});

// 导出的函数用于记录debug级别的日志
exports.debug = (content) => {
	// 获取名为"debug"的logger实例
  let logger = log4js.getLogger("debug");
  // 设置logger的日志级别为debug
  logger.level = levels.debug;
  // 记录debug级别的日志内容
  logger.debug(content);
};

exports.info = (content) => {
  let logger = log4js.getLogger("info");
  logger.level = levels.info;
  logger.info(content);
};
// 警告
exports.warn = (content) => {
  let logger = log4js.getLogger("warn");
  logger.level = levels.warn;
  logger.warn(content);
};

exports.error = (content) => {
  let logger = log4js.getLogger("error");
  logger.level = levels.error;
  logger.error(content);
};
