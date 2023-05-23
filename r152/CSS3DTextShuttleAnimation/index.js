import * as THREE from "three";

import TWEEN from "three/addons/libs/tween.module.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

import { random } from "three/addons/utils/CommonUtils.js";

const TEXT = [
  "仁为万善之本",
  "严以律己，宽以待人",
  "为人诚信，以和为贵",
  "人无忠信，不可立于世",
  "精诚所加，金石为开",
  "矢志向学，敢于胜利",
  "家和万事兴，齐力共断金",
  "成家之道，日俭与勤",
  "以爱兴家，以德治家",
  "天道酬勤，凡事感恩",
  "勤善和美，崇善孝敬",
  "学以修身，学以立志",
  "尊师重道，谦恭礼让",
  "知足常乐，善待人生",
  "施恩无念，受恩莫忘",
  "待人宽和，世事练达",
];

let camera, scene, renderer;

const objects = [];

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 6000;

  scene = new THREE.Scene();

  for (let i = 0; i < TEXT.length; i += 1) {
    const element = document.createElement("div");
    element.className = "element";

    const symbol = document.createElement("div");
    symbol.className = "symbol";
    symbol.textContent = TEXT[i];
    element.appendChild(symbol);

    const objectCSS = new CSS3DObject(element);
    objectCSS.position.x = random(-1000, 1000);
    objectCSS.position.y = random(-500, 500);
    objectCSS.position.z = random(-5000, -1000);

    objects.push(objectCSS);
    scene.add(objectCSS);
  }

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  for (let obj of objects) {
    obj.position.z += 10;

    if (obj.position.z > 6000) {
      obj.position.z = random(-5000, -1000);
    }
  }
  render();
}

function render() {
  renderer.render(scene, camera);
}
