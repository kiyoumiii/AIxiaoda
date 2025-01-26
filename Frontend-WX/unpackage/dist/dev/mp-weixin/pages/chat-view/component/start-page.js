"use strict";
const common_vendor = require("../../../common/vendor.js");
const common_assets = require("../../../common/assets.js");
const store_index = require("../../../store/index.js");
const _sfc_main = {
  __name: "start-page",
  setup(__props) {
    const problemData = [
      {
        icon: common_assets.M1,
        title: "农夫山泉新品上市策略",
        problem: "请分析近期农夫山泉“绿瓶”纯净水上市的原因，并结合同期农夫山泉的价格战以及纯净水的广告营销话术，并指出对其他矿泉水品牌可能产生的影响，并分析消费者在其中的角色和可能受到的影响。"
      },
      {
        icon: common_assets.M2,
        title: "2024电动汽车年中大盘点",
        problem: "帮我整理一下2024年电动汽车行业的大动态&大新闻"
      },
      {
        icon: common_assets.M3,
        title: "活动方案策划",
        problem: "设计一份党纪学习教育实践活动的方案策划。活动主办方是某市街道办党组织，时间是2024年7月，目标是以实践教学形式增强党员同志的党性意识、纪律教育，积极推动大家“学纪、知纪、明纪、守纪”，主要活动内容包括： 1、活动背景和目的 2、活动主题和指导思想 3、活动时间和地点 4、活动参与对象 5、活动议程 活动内容和活动形式尽可能详细，需包括以下三个活动项目： （1）党支部书记领学，发表相关讲话：带领大家学习习近平总书记关于加强党的纪律建设的重要论述、新修订的《中国共产党纪律处分条例》，党员以小组为代表发表学习感想； （2）参观学习红色景点和展览：中共纪律建设历史陈列馆、中共“五大”会址、毛泽东同志旧居和武昌农民运动讲习所； （3）围绕“廉洁护青春、建功新时代”这一主题开展党纪知识竞赛。 注：项目标题自拟，要求有吸引力、格式对仗。此外，要求活动设计贴近实际生活，活动形式新颖，活动类型多样。 6、活动要求"
      },
      {
        icon: common_assets.M4,
        title: "申论备考干货汇总",
        problem: "基于6篇文档，归纳出详细、具体的申论写作技巧，同时就如何提升申论写作的能力，为一位马克思专业的考生给出备考建议，列出一周的学习计划（要求结合该学生的专业背景提出切实有效的建议）。"
      },
      {
        icon: common_assets.M5,
        title: "心得体会",
        problem: "请帮我写《红岩》心得体会，字数不少于800字。"
      },
      {
        icon: common_assets.M6,
        title: "评析申论范文",
        problem: "评阅9篇申论范文的优缺点。以国家公务员申论考试为标准，从主题、结构、语言的维度进行评阅，并给上述每篇范文分别提出修改建议。"
      },
      {
        icon: common_assets.M7,
        title: "领导发言稿润色",
        problem: "润色这篇讲话稿，要求保留全文主要意思和结构，适当增加引经据典。"
      },
      {
        icon: common_assets.M8,
        title: "云南热门景点",
        problem: "我来云南旅游，请给我一些热门景点或者路线作参考"
      }
    ];
    common_vendor.onLoad(() => {
      rendomData("001");
    });
    const newData = common_vendor.ref([]);
    const isRotating = common_vendor.ref(false);
    const rendomData = (val) => {
      if (isRotating.value)
        return;
      newData.value = [...problemData].sort(() => Math.random() - 0.5).splice(0, 4);
      if (val === "002") {
        isRotating.value = true;
        setTimeout(() => {
          isRotating.value = false;
        }, 1e3);
      }
    };
    const send = (val) => {
      store_index.chatbotMessage().startSending(val);
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: isRotating.value ? 1 : "",
        c: common_vendor.o(($event) => rendomData("002")),
        d: common_vendor.f(newData.value, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.title),
            c: common_vendor.t(item.problem),
            d: index,
            e: common_vendor.o(($event) => send(item.problem), index)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-621641d2"]]);
wx.createComponent(Component);
