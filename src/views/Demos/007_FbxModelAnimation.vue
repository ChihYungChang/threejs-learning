<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

import { Engine } from "../../engine/Engine";

import { Demo } from "../../demos/007_FbxModelAnimation/Demo";

let engine: Engine;

onMounted(() => {
  engine = new Engine({
    canvas: document.querySelector("#canvas") as HTMLCanvasElement,
    experience: Demo,
    info: {
      twitter: "https://twitter.com/chihyungchang66",
      github: "https://github.com/ChihYungChang/threejs-learning",
      description: "老虎动画",
      documentTitle: "老虎动画",
      title: "老虎动画",
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
