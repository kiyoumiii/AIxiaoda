"use strict";
const common_vendor = require("../../../common/vendor.js");
const store_index = require("../../../store/index.js");
const _sfc_main = {
  __name: "ai-drawing",
  setup(__props) {
    const store = store_index.chatCreateImages();
    const styleList = common_vendor.ref([
      {
        icon: "/static/fengge/001.png",
        style: "无风格",
        color: "#1F9BE5"
      },
      {
        icon: "/static/fengge/002.png",
        style: "动漫风格",
        color: "#4F965E"
      },
      {
        icon: "/static/fengge/003.png",
        style: "写实",
        color: "#93726F"
      },
      {
        icon: "/static/fengge/004.jpg",
        style: "Q版简绘",
        color: "#204251"
      },
      {
        icon: "/static/fengge/005.png",
        style: "治愈男生",
        color: "#656565"
      },
      {
        icon: "/static/fengge/006.png",
        style: "治愈女生",
        color: "#D49D7D"
      },
      {
        icon: "/static/fengge/007.png",
        style: "卡通手绘",
        color: "#ff9999"
      },
      {
        icon: "/static/fengge/008.png",
        style: "复古动漫",
        color: "#ffcc66"
      },
      {
        icon: "/static/fengge/009.png",
        style: "港风胶片",
        color: "#cc3300"
      }
    ]);
    const selectIndex = common_vendor.ref(0);
    const content = common_vendor.ref("");
    const submitCreation = () => {
      if (store_index.inProgress().queryValue())
        return false;
      if (content.value.trim() === "")
        return false;
      store.seartSending(`${content.value},风格：${styleList.value[selectIndex.value].style}`);
    };
    const previewMedia = (url) => {
      common_vendor.index.previewMedia({
        sources: [{ url }]
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(styleList.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.style),
            c: item.color,
            d: common_vendor.o(($event) => selectIndex.value = index, index),
            e: index,
            f: selectIndex.value === index ? 1 : ""
          };
        }),
        b: content.value,
        c: common_vendor.o(($event) => content.value = $event.detail.value),
        d: common_vendor.f(common_vendor.unref(store).messages, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.prompt),
            b: item.url != ""
          }, item.url != "" ? {
            c: item.url,
            d: common_vendor.o(($event) => previewMedia(item.url), index)
          } : {}, {
            e: index
          });
        }),
        e: common_vendor.o(submitCreation)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2fc7909e"]]);
wx.createComponent(Component);
