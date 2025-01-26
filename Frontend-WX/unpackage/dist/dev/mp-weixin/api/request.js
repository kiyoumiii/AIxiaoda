"use strict";
const common_vendor = require("../common/vendor.js");
const store_index = require("../store/index.js");
const requestUrl = "http://192.168.31.6:7000";
let buffer = "";
const aliyunUrl = "wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1";
const appKey = "2xufWgZO57xXT1wn";
const uploadUrl = "https://meituan.thexxdd.cn/cha/file/uploadfile";
function getToken() {
  const token = common_vendor.index.getStorageSync("userInfo").token || "";
  const base64Token = common_vendor.encode(token + ":");
  return "Basic " + base64Token;
}
const request = (url, method, data = {}, enableChunked = false) => {
  return new Promise((resolve, reject) => {
    const requestTask = common_vendor.wx$1.request({
      url: requestUrl + url,
      method,
      data,
      enableChunked,
      header: { Authorization: getToken() },
      success: (res) => {
        const status = res.statusCode;
        switch (status) {
          case 200:
            resolve(res.data);
            break;
          case 404:
            console.error("404异常");
            reject("404");
            break;
          case 401:
            store_index.userData().isLogin = false;
            console.error("401没有访问权限");
            reject("401");
            break;
          case 500:
          case 501:
          case 502:
          case 503:
            console.log(res.data);
            common_vendor.index.showToast({
              icon: "none",
              title: "出现异常"
            });
            reject("出现异常");
            break;
          case 400:
            console.error(res);
            reject("400");
            break;
          case 422:
            console.error(res.data);
            common_vendor.index.showToast({
              icon: "none",
              title: res.data.msg
            });
            reject("422");
            break;
        }
      },
      fail: (err) => {
        console.log(err);
        common_vendor.index.showToast({
          icon: "none",
          title: "出现异常"
        });
      }
    });
    requestTask.onChunkReceived((response) => {
      let arrayBuffer = response.data;
      const arrayBufferss = new Uint8Array(arrayBuffer);
      let string = "";
      for (let i = 0; i < arrayBufferss.length; i++) {
        string += String.fromCharCode(arrayBufferss[i]);
      }
      buffer += decodeURIComponent(escape(string));
      while (buffer.includes("\n")) {
        const index = buffer.indexOf("\n");
        const chunk = buffer.slice(0, index);
        buffer = buffer.slice(index + 1);
        if (chunk.startsWith("data: ") && !chunk.includes("[DONE]")) {
          const jsonData = JSON.parse(chunk.replace("data: ", ""));
          store_index.chatbotMessage().handleText(jsonData);
        }
      }
    });
  });
};
const createCompletions = (params) => {
  return request("/create-completions", "POST", params, true);
};
const createImages = (params) => {
  return request("/create-images", "POST", params);
};
const aliToken = () => {
  return request("/alitoken", "GET");
};
const wxLogin = (params) => {
  return request("/wxlogin", "POST", params);
};
const saveChatHistory = (params) => {
  return request("/save-chat-history", "POST", params);
};
const userChatList = () => {
  return request("/fetch-chat-history", "GET");
};
const onlyChatHistory = (params) => {
  return request("/only-chat-history", "GET", params);
};
exports.aliToken = aliToken;
exports.aliyunUrl = aliyunUrl;
exports.appKey = appKey;
exports.createCompletions = createCompletions;
exports.createImages = createImages;
exports.onlyChatHistory = onlyChatHistory;
exports.saveChatHistory = saveChatHistory;
exports.uploadUrl = uploadUrl;
exports.userChatList = userChatList;
exports.wxLogin = wxLogin;
