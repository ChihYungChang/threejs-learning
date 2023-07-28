import Home from "./views/Home.vue";
import Box_001 from "./views/Demos/001_Box.vue";
import TextShuttleAnimation_002 from "./views/Demos/002_TextForwardAnimation.vue";
import TextWrappingIrregularCurveAnimation_003 from "./views/Demos/003_TextWrappingIrregularCurveAnimation.vue";
import ModelMetalTexture_004 from "./views/Demos/004_3DModelMetalTexture.vue";
import ParticleAnimationWithTween_005 from "./views/Demos/005_ParticleAnimationWithTween.vue";
import TextWrappingSphereAnimation_006 from "./views/Demos/006_TextWrappingSphereAnimation.vue";
import FbxModelAnimation_007 from "./views/Demos/007_FbxModelAnimation.vue";

/** @type {import('vue-router').RouterOptions['routes']} */
export const routes = [
  {
    path: "/",
    component: Home,
    meta: { title: "Home" },
    redirect: "001_box",
    children: [
      {
        path: "/001_box",
        meta: { title: "一个立方体", coverPath: "001_box/cover.png" },
        component: Box_001,
      },
      {
        path: "/002_TextForwardAnimation",
        meta: {
          title: "文本前进动画",
          coverPath: "002_TextForwardAnimation/preview.png",
        },
        component: TextShuttleAnimation_002,
      },
      {
        path: "/003_TextWrappingIrregularCurveAnimation",
        meta: {
          title: "文本不规则环绕动画",
          coverPath: "003_TextWrappingIrregularCurveAnimation/preview.png",
        },
        component: TextWrappingIrregularCurveAnimation_003,
      },
      {
        path: "/004_3DModelMetalTexture",
        meta: {
          title: "模型金属材质",
          coverPath: "004_3DModelMetalTexture/preview.png",
        },
        component: ModelMetalTexture_004,
      },
      {
        path: "/005_ParticleAnimationWithTween",
        meta: {
          title: "使用Tween实现粒子动画",
          coverPath: "005_ParticleAnimationWithTween/preview.png",
        },
        component: ParticleAnimationWithTween_005,
      },
      {
        path: "/006_TextWrappingSphereAnimation",
        meta: {
          title: "文字环绕球体动画",
          coverPath: "006_TextWrappingSphereAnimation/preview.png",
        },
        component: TextWrappingSphereAnimation_006,
      },
      {
        path: "/007_FbxModelAnimation",
        meta: {
          title: "老虎模型动画",
          coverPath: "007_FbxModelAnimation/preview.png",
        },
        component: FbxModelAnimation_007,
      },
    ],
  },
  {
    path: "/:path(.*)",
    component: () => import("./views/NotFound.vue"),
  },
];
