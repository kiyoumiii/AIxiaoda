const { ZhipuAI } = require("zhipuai-sdk-nodejs-v4");
const { apiKey } = require("@/config/default").zhipu;
const Validate = require("@/validate/index");
const ai = new ZhipuAI({ apiKey });
class ZhipuaiController {
  // 文生文
  async createCompletions(ctx) {
    const { messages } = ctx.request.body;
    // console.log(messages);
    await Validate.isarrayCheck(messages, "缺少对话信息", "messages");
    const data = await ai.createCompletions({
      model: "glm-4-0520",
      messages,
      stream: true,
      tools: [
        {
          type: "web_search",
          web_search: {
            enable: true,
            search_result: true,
          },
        },
      ],
    });
    ctx.status = 200;
    // console.log(data);
    // 遍历异步可迭代对象
    for await (const chunk of data) {
      console.log(chunk.toString());
      // 将数据逐个写入到http响应中
      ctx.res.write(chunk);
    }
  }
  // 文生图
  async createImages(ctx) {
    const { prompt } = ctx.request.body;
    await Validate.nullCheck(prompt, "请输入图像的文本描述", "prompt");
    const imageData = await ai.createImages({
      model: "cogview-3",
      prompt,
    });
    ctx.send({
      url: imageData.data[0].url,
      prompt: "我已为你生成对应的图片,你可以继续问我!",
    });
  }
}

module.exports = new ZhipuaiController();
