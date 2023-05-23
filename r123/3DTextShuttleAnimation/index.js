import * as THREE from "three";
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

const fontSize = 2;
const maxCameraDistance = 100;

const objects = [];

/**
 * 初始化文字
 */
const loadFont = () => {
  const loader = new THREE.FontLoader();
  return new Promise((resolve, reject) => {
    loader.load("../lib/fonts/Slideqiuhong_Regular.json", function (font) {
      resolve(font);
    });
  });
};

/**
 * 创建几何文字
 */
const createTextGeometry = (font, text, config) => {
  const def = {
    size: 1,
    height: 0.5,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  };
  if (config) {
    Object.assign(def, config);
  }
  const geometry = new THREE.TextGeometry(text, {
    font: font,
    ...def,
  });

  return geometry;
};

async function init() {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = maxCameraDistance;

  scene = new THREE.Scene();

  // 创建一个三维坐标轴
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  const font = await loadFont();

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 使用基础材质
  // 加载贴图
  var textureLoader = new THREE.TextureLoader();
  var texture = textureLoader.load("./texture.png");

  // 应用贴图到文字材质
  textMaterial.map = texture;

  for (let i = 0; i < TEXT.length; i += 1) {
    const strArr = TEXT[i].split("");
    const obj = new THREE.Object3D();
    let y = random(-50, 50);
    let x = random(-50, 50);
    for (let j = 0; j < strArr.length; j++) {
      const textGeo = createTextGeometry(font, strArr[j], { size: fontSize });

      // 创建文本网格
      const textMesh = new THREE.Mesh(textGeo, textMaterial);
      textMesh.position.x = x;
      textMesh.position.y = y;
      textMesh.position.z = 0;

      y += fontSize + 0.5;
      obj.add(textMesh);
      objects.push(obj);
    }
    scene.add(obj);
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);

  for (let obj of objects) {
    obj.position.z += 0.1;

    if (obj.position.z > maxCameraDistance) {
      obj.position.z = random(-200, 0);
    }
  }
  render();
}

function render() {
  if (renderer) {
    renderer.render(scene, camera);
  }
}

init();
animate();
