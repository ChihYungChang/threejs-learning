import Home from "./views/Home.vue";
import Box from "./views/Demos/Box.vue";
import TextShuttleAnimation from "./views/Demos/3DTextShuttleAnimation.vue";

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
    ],
  },
  {
    path: "/:path(.*)",
    component: () => import("./views/NotFound.vue"),
  },
];
