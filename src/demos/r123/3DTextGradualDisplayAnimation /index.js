import * as THREE from "three";

// 创建场景
var scene = new THREE.Scene();

// 创建相机
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// 创建渲染器
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 创建立方体
var geometry = new THREE.BoxGeometry(1, 3, 1);
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load("./texture.png"); // 替换为你的图片路径
var material = new THREE.MeshBasicMaterial({
  map: texture,
  transparent: true,
  opacity: 0,
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 创建动画函数
function animate() {
  requestAnimationFrame(animate);

  // 逐渐增加透明度
  if (cube.material.opacity < 1) {
    cube.material.opacity += 0.01;
    cube.material.needsUpdate = true;
  }

  // 渲染场景
  renderer.render(scene, camera);
}

// 执行动画
animate();
