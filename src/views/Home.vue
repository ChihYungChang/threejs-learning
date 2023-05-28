<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { routes } from "../routes";
const menuList = ref(routes[0].children);

const route = useRoute();
const router = useRouter();
const onClickSwitchCase = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="relative">
    <div class="menu">
      <div
        :class="{ card: true, select: route.path == item.path }"
        v-for="item in menuList"
        @click="onClickSwitchCase(item.path)"
      >
        <div class="cover">
          <img
            :src="`src/assets/images/demos/${item.meta.coverPath}`"
            loading="lazy"
            width="400"
          />
        </div>
        <div class="title">{{ item.meta.title }}</div>
      </div>
    </div>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.relative {
  display: flex;
  align-items: center;
  height: 100vh;
  .menu {
    height: 100vh;
    max-width: 300px;
    min-width: 300px;
    .card {
      margin: 10px;
      border-radius: 3px;
      overflow: hidden;
      background-color: #1c0054;
      padding-bottom: 6px;
      cursor: pointer;
      &.select {
        border: 4px solid #00eeff;
      }
      .cover {
        padding-bottom: 56.25%;
        position: relative;
        overflow: hidden;
        img {
          position: absolute;
          width: 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .title {
        color: #fff;
        padding: 8px 12px 4px;
        font-weight: 500;
      }
    }
  }
  .container {
    width: calc(100vw - 300px);
    height: 100vh;
    flex: 1;
  }
}
</style>
