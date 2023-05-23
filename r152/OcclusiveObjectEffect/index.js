import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { InstancedFlow } from "three/addons/modifiers/CurveModifier.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import { random } from "three/addons/utils/CommonUtils.js";

const TEXT = [
  "大数据",
  "云计算",
  "虚拟现实",
  "XR拓展",
  "增强现实",
  "5G互联网",
  "数字人",
  "虚实交互",
  "物联网",
  "元宇宙",
  "可视化",
  "AIGC",
  "人工智能",
];

let stats;
let scene, camera, renderer;

const flowList = []; // 流列表

/**
 * 初始化场景
 */
const init = async () => {
  scene = new THREE.Scene();

  // 创建一个三维坐标轴
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(2, 2, 4);
  camera.lookAt(scene.position);

  // 创建平板
  createHidePlane();

  // 初始化曲线列表
  const pointList = initCurvesPoint(TEXT.length);
  const curves = await initCatmullRomCurve3List(pointList);

  // 加载字体
  const font = await loadFont();

  const light = new THREE.DirectionalLight(0xffaa33);
  light.position.set(-10, 10, 10);
  light.intensity = 1.0;
  scene.add(light);

  const light2 = new THREE.AmbientLight(0x003973);
  light2.intensity = 1.0;
  scene.add(light2);

  for (const text of TEXT) {
    const textGeometry = createTextGeometry(font, text);

    const { curve, line } = curves[parseInt(random(curves.length - 1))];

    const flow = createCurvesFlow(curve, textGeometry);
    flowList.push({ flow, curve });
    scene.add(flow.object3D); // 将曲线流添加到场景
  }

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);
  window.addEventListener("resize", onWindowResize);
};

/**
 * 初始化文字
 */
const loadFont = () => {
  const loader = new FontLoader();
  return new Promise((resolve, reject) => {
    loader.load("../lib/fonts/FZKai-Z03S_Regular.json", function (font) {
      resolve(font);
    });
  });
};

const createHidePlane = () => {
  const geometry = new THREE.PlaneGeometry(10, 10);
  const hiderMaterial = new THREE.MeshStandardMaterial();
  hiderMaterial.colorWrite = false;
  const plane = new THREE.Mesh(geometry, hiderMaterial);
  scene.add(plane);
};

/**
 * 创建几何文字
 */
const createTextGeometry = (font, text, config) => {
  const def = {
    size: 0.08,
    height: 0.0005,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 5,
  };
  if (config) {
    Object.assign(def, config);
  }
  const geometry = new TextGeometry(text, {
    font: font,
    ...def,
  });

  geometry.rotateX(Math.PI);

  return geometry;
};

/**
 * 初始化
 * @param {*} count
 */
const initCurvesPoint = (count) => {
  const point = [];
  for (let i = 0; i < count; i++) {
    const r = parseFloat(random(0.5, 0.9) + "");
    point.push([
      { x: -r, y: random(0.3, 0.8), z: -r },
      { x: -r, y: random(0.3, 0.8), z: r },
      { x: r, y: random(0.3, 0.8), z: r },
      { x: r, y: random(0.3, 0.8), z: -r },
    ]);
  }
  return point;
};

/**
 * 初始化曲线对象
 * @param {*} count 数量
 * @returns
 */
const initCatmullRomCurve3List = (pointList) => {
  const curves = [...pointList].map(function (curvePoints) {
    const curveVertices = curvePoints.map(function (handlePos) {
      const { x, y, z } = handlePos;
      return new THREE.Vector3(x, y, z);
    });

    const curve = new THREE.CatmullRomCurve3(curveVertices);
    curve.curveType = "centripetal";
    curve.closed = true;

    const points = curve.getPoints(50);

    // 线
    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );

    // scene.add(line);

    return {
      curve,
      line,
    };
  });

  console.log(curves);

  return curves;
};

/**
 * 创建一个曲线流
 * @param {*} curve CatmullRomCurve3 三维样条曲线
 * @param {*} geometry 文字
 * @returns
 */
const createCurvesFlow = (curve, geometry) => {
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });

  const instanceCount = 1; // 曲线上实例数
  const flow = new InstancedFlow(instanceCount, 1, geometry, material);
  flow.updateCurve(0, curve);
  flow.setCurve(0, 0);
  flow.moveIndividualAlongCurve(0, random(0, 1));
  flow.object3D.setColorAt(0, new THREE.Color(0xffffff));

  return flow;
};

/**
 * 窗口变化
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * 动画
 */
function animate() {
  requestAnimationFrame(animate);

  for (const item of flowList) {
    const { flow, curve } = item;
    const { points } = curve;
    const time = Date.now() * 0.001;
    for (let p of points) {
      const amplitude = 0.01; // 震荡幅度
      const frequency = 0.1; // 震荡频率

      // p.x += Math.sin(time + i * 10) * amplitude * frequency;
      p.y += Math.sin(time) * frequency * amplitude;
    }

    flow.updateCurve(0, curve);
    flow.moveAlongCurve(0.0009);
  }

  const applyHiderMaterial = (mesh) => {
    if (!mesh) {
      return;
    }
    if (mesh.material) {
      mesh.material = hiderMaterial;
    }
    mesh.traverse((node) => {
      if (node.isMesh) {
        node.material = hiderMaterial;
      }
    });
  };

  render();
}

function render() {
  if (renderer) {
    renderer.render(scene, camera);
  }

  if (stats) {
    stats.update();
  }
}

init();
animate();
