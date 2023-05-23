import * as THREE from "three";

let scene, camera, renderer;
let particleSystem;

const particleCount = 100; // 粒子数量
const particleDistance = 5; // 粒子到达顶部的距离

function init() {
  // 创建场景
  scene = new THREE.Scene();

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 5;
  camera.position.x = 5;
  camera.lookAt(0, 0, 0);

  // 创建光源
  const light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 0, 5);
  scene.add(light);

  // 创建一个三维坐标轴
  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 创建粒子系统的几何体
  const geometry = new THREE.BufferGeometry();

  // 创建粒子的材质
  const material = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    map: new THREE.TextureLoader().load("light-effect.png"),
  });

  // 创建粒子系统的粒子
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const accList = new Float32Array(particleCount);
  const radiusList = new Float32Array(particleCount);
  const angleList = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const theta = i * ((Math.PI * 2) / particleCount);

    angleList[i] = theta;

    const radius = THREE.MathUtils.randFloat(0.1, 1);

    const x = Math.sin(theta) * radius;
    const y = 0;
    const z = Math.cos(theta) * radius;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    colors[i * 3] = 1;
    colors[i * 3 + 1] = 1;
    colors[i * 3 + 2] = 1;

    accList[i] = THREE.MathUtils.randFloat(0.01, 0.05);
    radiusList[i] = radius;
  }

  // 将粒子位置数据添加到几何体中
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("accList", new THREE.BufferAttribute(accList, 1));
  geometry.setAttribute("radiusList", new THREE.BufferAttribute(radiusList, 1));
  geometry.setAttribute("angleList", new THREE.BufferAttribute(angleList, 1));

  // 创建粒子系统
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);
}

let angle = 0;
function updateParticles() {
  const positions = particleSystem.geometry.attributes.position.array;
  const accList = particleSystem.geometry.attributes.accList.array;
  const radiusList = particleSystem.geometry.attributes.radiusList.array;
  const angleList = particleSystem.geometry.attributes.angleList.array;
  angle += 0.01; // 增加旋转角度
  for (let i = 0; i < positions.length; i++) {
    const a = accList[i];
    const r = radiusList[i];
    const agl = angleList[i];

    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    positions[i * 3] = Math.sin(agl + angle + a) * r; // 计算新的x位置
    positions[i * 3 + 1] += a; // 更新粒子的位置，使其向上移动
    positions[i * 3 + 2] = Math.cos(agl + angle) * r; // 计算新的z位置

    // 判断粒子是否超过一定距离，如果是则设置y坐标为初始位置，使其重新出现在底部
    if (y > particleDistance) {
      positions[i * 3 + 1] = 0;
    }
  }

  // 告诉Three.js更新粒子系统的几何体数据
  particleSystem.geometry.attributes.position.needsUpdate = true;
}

function animate() {
  requestAnimationFrame(animate);
  updateParticles();
  renderer.render(scene, camera);
}

init();
animate();
