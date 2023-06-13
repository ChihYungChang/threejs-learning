<script setup lang="ts">
import { reactive, onMounted, onUnmounted } from "vue";

import { Engine } from "../../engine/Engine";

import { Demo } from "../../demos/001_Box/Demo";

let engine: Engine;

onMounted(() => {
  engine = new Engine({
    canvas: document.querySelector("#canvas") as HTMLCanvasElement,
    experience: Demo,
    info: {
      twitter: "https://twitter.com/chihyungchang66",
      github: "https://github.com/ChihYungChang/threejs-learning",
      description: "平面图上的立方体",
      documentTitle: "平面图上的立方体",
      title: "平面图上的立方体",
    },
  });
});

onUnmounted(() => {
  console.log("box 卸载");
  engine?.destory();
});
</script>

<template>
  <canvas id="canvas"></canvas>
</template>
