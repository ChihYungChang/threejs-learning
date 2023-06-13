import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";
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

export class Demo implements Experience {
  resources: Resource[] = [
    {
      type: "font",
      path: "./font/Alibaba PuHuiTi 2.0 115 Black_Regular.json",
      name: "font",
    },
  ];

  sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> | undefined;

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 3;
    engine.camera.instance.position.x = 1;
    engine.camera.instance.position.y = 2;
  }

  async init() {
    const axesHelper = new THREE.AxesHelper(100);
    this.engine.scene.add(axesHelper);

    this.engine.scene.add(new THREE.AmbientLight(0x404040, 5));

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(0, 50, 0);

    this.engine.scene.add(directionalLight);

    // 创建球体几何体
    const radius = 2;
    const segments = 64;
    const rings = 64;
    const geometry = new THREE.SphereGeometry(radius, segments, rings);

    const widthSegments = 32; // 横向细分段数
    const heightSegments = 32; // 纵向细分段数

    // 生成顶点数据
    const positions: any[] = [];
    for (let phiIndex = 0; phiIndex <= heightSegments; phiIndex++) {
      const phi = (phiIndex * Math.PI) / heightSegments;
      for (let thetaIndex = 0; thetaIndex <= widthSegments; thetaIndex++) {
        const theta = (thetaIndex * 2 * Math.PI) / widthSegments;

        // 计算点的坐标
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        positions.push(x, y, z);
      }
    }

    // 创建球体材质
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff00, // 球体的颜色
      transparent: true, // 开启透明
      opacity: 0, // 设置透明度
    });

    // 创建球体网格
    const sphere = new THREE.Mesh(geometry, material);

    this.sphere = sphere;

    // 将球体添加到场景
    this.engine.scene.add(sphere);

    // 加载字体
    let font = this.engine.resources.getItem("font");

    const totalCount = positions.length;

    const savePos: THREE.Vector3[] = [];
    const textMeshes = []; // 存储文本网格的数组

    // 创建并布局文本网格
    for (let i = 0; i < totalCount; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const pos = new THREE.Vector3(x, y, z);

      // 遍历文本数组
      const index = THREE.MathUtils.randInt(0, TEXT.length - 1);
      const textGeometry = new TextGeometry(TEXT[index], {
        font: font,
        size: 0.1 /* 字体大小 */,
        height: 0.001 /* 文本厚度 */,
        curveSegments: 12 /* 曲线点数 (5降低优化性能) */,
        bevelEnabled: false /* 是否开启斜角 */,
        bevelThickness: 0.01 /* 斜角深度 */,
        bevelSize: 0.01 /* 斜角与原始文本轮廓之间的延伸距离 */,
        bevelSegments: 3 /* 斜角的分段数 (3降低优化性能) */,
        bevelOffset: 0 /* 斜角偏移 */,
      });

      // 计算文本几何体的边界框
      textGeometry.computeBoundingBox();

      if (textGeometry) {
        // 根据文本几何体计算布局位置
        const textWidth =
          textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
        const textHeight =
          textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;
        const textCenterX = -textWidth / 2;
        const textCenterY = -textHeight / 2;
        // 平移到球体表面
        textGeometry.translate(textCenterX, textCenterY, 0);

        // 创建文本网格
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // 使用基础材质
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // 获取球体表面的法线向量
        const normal = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
        // 将文本网格平移到球体表面
        textMesh.position.copy(normal.multiplyScalar(radius));

        // 调整文字朝向球心
        textMesh.lookAt(new THREE.Vector3(pos.x * 2, pos.y * 2, pos.z * 2));

        const isClose = savePos.some(
          (p) => p.distanceTo(textMesh.position) <= 0.8
        );
        // 根据距离调整密度因子
        if (!isClose) {
          // 将文本网格添加到球体上
          sphere.add(textMesh);
          // 存储文本网格到数组中
          textMeshes.push(textMesh);
          savePos.push(textMesh.position);
        }
      }
    }
  }

  resize() {}

  update() {
    // 旋转球体
    this.sphere!.rotation.y += 0.01;
  }
}
