<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import { Engine } from "../../engine/Engine";

import { Demo } from "../../demos/3DTextWrappingIrregularCurveAnimation/Demo";

let engine: Engine;

onMounted(() => {
  engine = new Engine({
    canvas: document.querySelector("#canvas") as HTMLCanvasElement,
    experience: Demo,
    info: {
      twitter: "https://twitter.com/chihyungchang66",
      github: "https://github.com/ChihYungChang/threejs-learning",
      description: "3D文本不规则环绕动画",
      documentTitle: "3D文本不规则环绕动画",
      title: "3D文本不规则环绕动画",
    },
  });
});

onUnmounted(() => {
  engine?.destory();
});
</script>

<template>
  <canvas id="canvas"></canvas>
</template>
