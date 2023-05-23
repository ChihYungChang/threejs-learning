import * as THREE from "three";
import { random } from "three/addons/utils/CommonUtils.js";

let textureList = [];
let curveList = [];

let scene;
let camera;
let renderer;

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

  for (let i = 0; i < 4; i++) {
    let texture = new THREE.TextureLoader().load(
      "Light-Blue-PNG-Isolated-HD.png"
    );
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping; //每个都重复
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;

    textureList.push({ texture, a: random(0.008, 0.003) });

    let material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending, // 使用加法混合模式
      depthWrite: false, // 禁用深度写入
    });

    // 创建顶点数组
    const r = parseFloat(random(0.8, 2) + "");
    let points = [
      new THREE.Vector3(
        -r - random(0.01, 0.1),
        random(0, 1),
        -r - random(0.01, 0.1)
      ),
      new THREE.Vector3(-r - random(0.01, 0.1), random(0, 1), r),
      new THREE.Vector3(
        r + random(0.01, 0.1),
        random(0, 1),
        r + random(0.01, 0.1)
      ),
      new THREE.Vector3(
        r + random(0.01, 0.1),
        random(0, 1),
        -r - random(0.01, 0.1)
      ),
    ];

    // CatmullRomCurve3创建一条平滑的三维样条曲线
    let curve = new THREE.CatmullRomCurve3(points); // 曲线路径
    curve.curveType = "centripetal";
    curve.closed = true;

    // 创建管道
    let tubeGeometry = new THREE.TubeGeometry(
      curve,
      80,
      random(0.1, 0.3),
      parseInt(random(20, 30)),
      true
    );

    curveList.push({ curve, tubeGeometry });

    let mesh = new THREE.Mesh(tubeGeometry, material);

    scene.add(mesh);
  }
}

// 动画函数
function animate() {
  requestAnimationFrame(animate);

  if (textureList) {
    for (let { texture, a } of textureList) {
      texture.offset.x -= a;
    }
  }

  if (curveList) {
    const time = Date.now() * 0.001;

    for (const { tubeGeometry } of curveList) {
      const amplitude = random(0.01, 0.02); // 震荡幅度
      const frequency = random(0.5, 1); // 震荡频率
      // 获取TubeGeometry的顶点属性
      const positions = tubeGeometry.attributes.position.array;

      // 遍历顶点数组，修改顶点位置
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        // 根据需要修改顶点的坐标
        // 例如，根据时间或其他参数计算新的顶点位置
        const newX = x + Math.sin(time) * frequency * amplitude;
        const newY = y + Math.sin(time) * frequency * amplitude;
        const newZ = z + Math.sin(time) * frequency * amplitude;

        // 更新顶点坐标
        positions[i] = newX;
        positions[i + 1] = newY;
        positions[i + 2] = newZ;
      }

      // 告诉Three.js更新顶点属性
      tubeGeometry.attributes.position.needsUpdate = true;
    }
  }

  if (renderer) renderer.render(scene, camera);
}

init();
animate();
