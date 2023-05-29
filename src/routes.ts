import Home from "./views/Home.vue";
import Box from "./views/Demos/Box.vue";
import TextShuttleAnimation from "./views/Demos/3DTextShuttleAnimation.vue";
import TextWrappingIrregularCurveAnimation from "./views/Demos/3DTextWrappingIrregularCurveAnimation.vue";
import ModelMetalTexture from "./views/Demos/3DModelMetalTexture.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    path: "/",
    component: Home,
    meta: { title: "Home" },
    redirect: "box",
    children: [
      {
        path: "/box",
        meta: { title: "一个立方体", coverPath: "box/cover.png" },
        component: Box,
      },
      {
        path: "/3DTextShuttleAnimation",
        meta: {
          title: "3D文本穿梭动画",
          coverPath: "3DTextShuttleAnimation/preview.png",
        },
        component: TextShuttleAnimation,
      },
      {
        path: "/3DTextWrappingIrregularCurveAnimation",
        meta: {
          title: "3D文本不规则环绕动画",
          coverPath: "3DTextWrappingIrregularCurveAnimation/preview.png",
        },
        component: TextWrappingIrregularCurveAnimation,
      },
      {
        path: "/3DModelMetalTexture",
        meta: {
          title: "模型金属材质",
          coverPath: "3DModelMetalTexture/preview.png",
        },
        component: ModelMetalTexture,
      },
    ],
  },
  {
    path: "/:path(.*)",
    component: () => import("./views/NotFound.vue"),
  },
];
