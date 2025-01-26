"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const wxcomponents_towxml_index = require("./wxcomponents/towxml/index.js");
if (!Math) {
  "./pages/chat-view/index.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      const buttonPosition = common_vendor.index.getStorageSync("buttonPosition");
      if (!buttonPosition) {
        const res = common_vendor.index.getMenuButtonBoundingClientRect();
        console.log(res);
        common_vendor.index.setStorageSync("buttonPosition", res);
      }
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$towxml = wxcomponents_towxml_index.useTowxml;
  app.use(common_vendor.createPinia());
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
