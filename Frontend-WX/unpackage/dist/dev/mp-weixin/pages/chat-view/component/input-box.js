"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const store_index = require("../../../store/index.js");
const api_request = require("../../../api/request.js");
const voice_st = require("../../../voice/st.js");
const _sfc_main = {
  __name: "input-box",
  setup(__props) {
    common_vendor.useCssVars((_ctx) => ({
      "296f6731": textareaValue.alignItems,
      "5577b0c6": textareaValue.height,
      "02961b40": textareaHeight.value
    }));
    const instance = common_vendor.getCurrentInstance();
    const show = common_vendor.ref(true);
    const textareaValue = common_vendor.reactive({
      autoHeight: true,
      alignItems: "center",
      height: "0px"
    });
    const lineChange = (event) => {
      const { height, lineCount } = event.detail;
      textareaValue.alignItems = lineCount >= 2 ? "flex-end" : "center";
      if (lineCount >= 6) {
        textareaValue.autoHeight = false;
        textareaValue.height = height;
      } else {
        textareaValue.autoHeight = true;
      }
    };
    const textareaHeight = common_vendor.ref("");
    common_vendor.onMounted(() => {
      setTimeout(() => {
        const query = common_vendor.index.createSelectorQuery().in(instance);
        query.select(".input-content").boundingClientRect((res) => {
          textareaHeight.value = res.height + "px";
        }).exec();
      }, 300);
    });
    const barData = common_vendor.ref([
      "1s",
      "0.9s",
      "0.8s",
      "0.7s",
      "0.6s",
      "0.5s",
      "0.4s",
      "0.3s",
      "0.2s",
      "0.1s",
      "1s",
      "0.9s",
      "0.8s",
      "0.7s",
      "0.6s",
      "0.5s",
      "0.4s",
      "0.3s",
      "0.2s",
      "0.1s"
    ]);
    const showAudio = common_vendor.ref(false);
    const inputContent = common_vendor.ref("");
    const recorderManager = common_vendor.wx$1.getRecorderManager();
    const launckVoice = common_vendor.ref(null);
    recorderManager.onError((res) => {
      showAudio.value = false;
      const typeData = [
        {
          type: "operateRecorder:fail auth deny",
          text: "右上角里设置里打开麦克风"
        },
        {
          type: "operateRecorder:fail NotFoundError",
          text: "请打开麦克风才可以说话"
        }
      ];
      typeData.forEach((item) => {
        if (res.errMsg == item.type) {
          common_vendor.index.showToast({
            icon: "none",
            title: item.text
          });
        }
      });
      launckVoice.value.shutdown();
    });
    const longpress = async () => {
      console.log("长安开始");
      if (store_index.inProgress().queryValue())
        return false;
      showAudio.value = true;
      await launckVoice.value.start(launckVoice.value.defaultStartParams());
      recorderManager.start({
        duration: 1e5,
        sampleRate: 16e3,
        numberOfChannels: 1,
        format: "PCM",
        frameSize: 4
      });
    };
    const touchend = () => {
      console.log("手指放开");
      showAudio.value = false;
      recorderManager.stop();
    };
    recorderManager.onFrameRecorded((res) => {
      console.log(res);
      launckVoice.value.sendAudio(res.frameBuffer);
    });
    recorderManager.onStop((res) => {
      console.log("录音结束了");
      console.log(res);
      showAudio.value = false;
      launckVoice.value.shutdown();
      if (storageArr.value.length > 0) {
        storageArr.value.forEach((item) => {
          inputContent.value += item.result;
        });
        setTimeout(async () => {
          await sendIng();
        }, 400);
      }
    });
    const storageArr = common_vendor.ref([]);
    common_vendor.onLoad(async () => {
      const token = await api_request.aliToken();
      const st = new voice_st.SpeechTranscription({
        url: api_request.aliyunUrl,
        token: token.data,
        appkey: api_request.appKey
      });
      launckVoice.value = st;
      st.on("started", () => {
        console.log("实时语音识别开始");
      });
      st.on("changed", (msg) => {
        console.log("实时语音识别中间结果");
        console.log(msg);
        const res = JSON.parse(msg);
        const queryIndex = storageArr.value.findIndex((item) => item.index === res.payload.index);
        if (queryIndex >= 0) {
          storageArr.value[queryIndex].result = res.payload.result;
        } else {
          storageArr.value.push(res.payload);
        }
      });
      st.on("end", (msg) => {
        console.log("提示句子结束");
        console.log(msg);
        const res = JSON.parse(msg);
        const queryIndex = storageArr.value.findIndex((item) => item.index === res.payload.index);
        if (queryIndex >= 0) {
          storageArr.value[queryIndex].result = res.payload.result;
        } else {
          storageArr.value.push(res.payload);
        }
      });
      st.on("closed", () => {
        console.log("连接关闭");
      });
      st.on("failed", (err) => {
        console.log("阿里云语音识别错误");
        console.log(err);
        common_vendor.index.showToast({
          icon: "none",
          title: "录音出现错误"
        });
      });
    });
    const sendIng = () => {
      console.log(inputContent.value);
      if (store_index.inProgress().queryValue())
        return false;
      if (inputContent.value.trim() === "")
        return false;
      store_index.chatbotMessage().startSending(inputContent.value.trim());
      inputContent.value = "";
      storageArr.value = [];
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => show.value = !show.value),
        b: show.value ? "/static/yuyin.png" : "/static/jianpan.png",
        c: textareaValue.autoHeight,
        d: common_vendor.o(lineChange),
        e: inputContent.value,
        f: common_vendor.o(($event) => inputContent.value = $event.detail.value),
        g: show.value,
        h: !show.value,
        i: common_vendor.o(longpress),
        j: common_vendor.o(touchend),
        k: common_assets._imports_0$1,
        l: common_vendor.o(sendIng),
        m: common_vendor.s(_ctx.__cssVars()),
        n: showAudio.value
      }, showAudio.value ? {
        o: common_vendor.s(_ctx.__cssVars())
      } : {}, {
        p: showAudio.value
      }, showAudio.value ? {
        q: common_vendor.t(storageArr.value.map((item) => item.result).join(" ")),
        r: common_vendor.s(_ctx.__cssVars())
      } : {}, {
        s: showAudio.value
      }, showAudio.value ? {
        t: common_vendor.f(barData.value, (item, index, i0) => {
          return {
            a: index,
            b: item
          };
        }),
        v: common_vendor.s(_ctx.__cssVars())
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4cc5f350"]]);
wx.createComponent(Component);
