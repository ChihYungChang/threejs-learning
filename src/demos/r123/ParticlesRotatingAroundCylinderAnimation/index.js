import * as THREE from "three";
import { random } from "three/addons/utils/CommonUtils.js";

// 创建场景
var scene = new THREE.Scene();

// 创建相机
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0.5, 0.5, 5);
camera.lookAt(0, 0, 0);

const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// 创建渲染器
var renderer = new THREE.WebGLRenderer({});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建粒子系统
var particleCount = 1000; // 粒子数量
var particles = new THREE.Geometry();
var particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.01,
  opacity: 1,
});

// 创建圆柱体
var cylinderRadius = 1;
var cylinderHeight = 2;
var cylinderSegments = 32;
var cylinderGeometry = new THREE.CylinderGeometry(
  cylinderRadius,
  cylinderRadius,
  cylinderHeight,
  cylinderSegments
);
var cylinderMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0,
  color: 0xffffff,
});
var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
scene.add(cylinder);

// 初始化粒子位置
for (var i = 0; i < particleCount; i++) {
  var angle = Math.random() * Math.PI * 2;
  var radius = Math.random() * 0.5;

  // 根据圆柱体的半径和高度计算粒子的位置
  var x = Math.cos(angle) * radius;
  var y = random(-cylinderHeight / 2, cylinderHeight / 2);
  var z = Math.sin(angle) * radius;

  var particle = new THREE.Vector3(x, y, z);
  particles.vertices.push(particle);
}

// 创建粒子系统对象
var particleSystem = new THREE.Points(particles, particleMaterial);
particleSystem.position.x = 1;
scene.add(particleSystem);

// 创建动画函数
function animate() {
  requestAnimationFrame(animate);

  // 使粒子系统围绕圆柱体旋转
  particleSystem.rotation.y += 0.1;

  // 渲染场景
  renderer.render(scene, camera);
}

// 执行动画
animate();
