import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";
import { createTextGeometry } from "../../utils/font";
import { InstancedFlow } from "three/examples/jsm/modifiers/CurveModifier";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

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
const flowList: { flow: InstancedFlow; curve: THREE.CatmullRomCurve3 }[] = []; // 流列表

export class Demo implements Experience {
  resources: Resource[] = [
    { name: "textTexture", path: "./texture/gold.png", type: "texture" },
    {
      name: "textFont",
      path: "./font/Alibaba PuHuiTi 2.0 115 Black_Regular.json",
      type: "font",
    },
  ];

  objects: THREE.Object3D<THREE.Event>[] = [];

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 100;
    engine.camera.instance.position.y = 25;
  }

  async init() {
    const axesHelper = new THREE.AxesHelper(100);
    this.engine.scene.add(axesHelper);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    this.engine.scene.add(plane);

    this.engine.scene.add(new THREE.AmbientLight(0x404040, 5));

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 50, 0);

    this.engine.scene.add(directionalLight);

    // 初始化曲线列表
    const pointList = initCurvesPoint(TEXT.length);
    const curves = await initCatmullRomCurve3List(pointList);

    // 加载字体
    const font = this.engine.resources.getItem("textFont");

    for (const text of TEXT) {
      const textGeometry = createTextGeometry(text, {
        font,
        size: 5,
        height: 1,
      });
      textGeometry.rotateX(-Math.PI);

      const { curve } = curves[THREE.MathUtils.randInt(0, curves.length - 1)];

      const flow = createCurvesFlow(curve, textGeometry);
      flowList.push({ flow, curve });
      this.engine.scene.add(flow.object3D); // 将曲线流添加到场景
    }
  }

  resize() {}

  update() {
    for (const item of flowList) {
      const { flow, curve } = item;
      const { points } = curve;
      const time = Date.now() * 0.001;
      for (let p of points) {
        const amplitude = 0.01; // 震荡幅度
        const frequency = 0.1; // 震荡频率
        p.y += Math.sin(time) * frequency * amplitude;
      }

      flow.updateCurve(0, curve);
      flow.moveAlongCurve(0.0009);
    }
  }
}

/**
 * 初始化
 * @param {*} count
 */
const initCurvesPoint = (count: number) => {
  const point = [];
  for (let i = 0; i < count; i++) {
    const r = THREE.MathUtils.randFloat(20, 30);
    point.push([
      { x: -r, y: THREE.MathUtils.randFloat(0, 50), z: -r },
      { x: -r, y: THREE.MathUtils.randFloat(0, 50), z: r },
      { x: r, y: THREE.MathUtils.randFloat(0, 50), z: r },
      { x: r, y: THREE.MathUtils.randFloat(0, 50), z: -r },
    ]);
  }
  return point;
};

/**
 * 初始化曲线对象
 * @param {*} count 数量
 * @returns
 */
const initCatmullRomCurve3List = (
  pointList: { x: number; y: number; z: number }[][]
) => {
  const curves = [...pointList].map(function (curvePoints) {
    const curveVertices = curvePoints.map(function (handlePos) {
      const { x, y, z } = handlePos;
      return new THREE.Vector3(x, y, z);
    });

    const curve = new THREE.CatmullRomCurve3(curveVertices);
    curve.curveType = "centripetal";
    curve.closed = true;

    const points = curve.getPoints(50);

    const line = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0x00ff00 })
    );

    return {
      curve,
      line,
    };
  });

  return curves;
};

/**
 * 创建一个曲线流
 * @param {*} curve CatmullRomCurve3 三维样条曲线
 * @param {*} geometry 文字
 * @returns
 */
const createCurvesFlow = (
  curve: THREE.CatmullRomCurve3,
  geometry: TextGeometry
) => {
  const material = new THREE.MeshStandardMaterial({
    color: 0xf7ff00,
  });
  const instanceCount = 1; // 曲线上实例数
  const flow = new InstancedFlow(instanceCount, 1, geometry, material);
  flow.updateCurve(0, curve);
  flow.setCurve(0, 0);
  flow.moveIndividualAlongCurve(0, THREE.MathUtils.randFloat(0, 1));
  flow.object3D.setColorAt(0, new THREE.Color(0xffffff));

  return flow;
};
