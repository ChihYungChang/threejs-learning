import * as THREE from "three";
import { random } from "three/addons/utils/CommonUtils.js";

// Canvas
const canvas = document.querySelector("#mainCanvas");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load(
  "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png"
);

/**
 * Particles
 */
// geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 6000;
const positions = new Float32Array(count * 3); // 每个点由三个坐标值组成（x, y, z）
const colors = new Flo  ·at32Array(count * 3); // 每个颜色由三个rgb组成
for (let i = 0; i < count; i += 3) {
  positions[i] = random(-5, 5);
  positions[i + 1] = random(-5, 5);
  positions[i + 2] = random(10, 5);
  colors[i] = 255;
  colors[i + 1] = 234;
  colors[i + 2] = 0;
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
particlesGeometry.setAttribute("target", new THREE.BufferAttribute(colors, 3));

// material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});

// pointMaterial.color = new THREE.Color("#ffffff");
pointMaterial.map = particleTexture;
pointMaterial.alphaMap = particleTexture;
pointMaterial.transparent = true;
// pointMaterial.alphaTest = 0.001
// pointMaterial.depthTest = false
pointMaterial.depthWrite = false;
pointMaterial.blending = THREE.AdditiveBlending;
pointMaterial.vertexColors = true;

const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ffffff", 1);
scene.add(ambientLight);

// Size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.5, 0.5, 5);
camera.lookAt(0, 0, 0);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// 创建立方体
var cubeGeometry = new THREE.BoxGeometry(0.6, 1, 0);
var cubeTextureLoader = new THREE.TextureLoader();
var texture = cubeTextureLoader.load("./CubeTexture.png"); // 替换为你的图片路径
var material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  opacity: 1,
});
var cube = new THREE.Mesh(cubeGeometry, material);
cube.position.z = -1;
scene.add(cube);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas,
  // antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animations
const clock = new THREE.Clock();

const ease = 0.05;

const tick = () => {
  const DD = 0.5;

  for (let i = 0; i < count; i += 3) {
    const px = particlesGeometry.attributes.position.getX(i);
    const py = particlesGeometry.attributes.position.getY(i);
    const pz = particlesGeometry.attributes.position.getZ(i);
    const posVec = new THREE.Vector3(px, py, pz);
    const initVec = new THREE.Vector3(0, 0, 0);
    const force = new THREE.Vector3();
    force.subVectors(initVec, posVec);

    // 绕原点旋转
    if (initVec.distanceTo(posVec) < DD) {
      var rotationSpeed = Math.random() * 0.5; // 旋转速度
      var axis = new THREE.Vector3(0, 1, 0); // 旋转轴
      posVec.applyAxisAngle(axis, rotationSpeed);
      posVec.y = random(-DD, DD);
    } else {
      posVec.x += force.normalize().x * ease;
      posVec.y += force.normalize().y * ease;
      posVec.z += force.normalize().z * ease;
    }

    particlesGeometry.attributes.position.setXYZ(
      i,
      posVec.x,
      posVec.y,
      posVec.z
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  pointMaterial.needsUpdate = true;

  // Render
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

tick();
