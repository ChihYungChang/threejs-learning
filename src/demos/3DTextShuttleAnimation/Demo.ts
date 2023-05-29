import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";
import { createTextGeometry } from "../../utils/font";

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

const fontSize = 4;
const maxCameraDistance = 50;

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
    engine.camera.instance.position.z = 200;
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

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xf7ff00 });
    const textTexture = this.engine.resources.getItem("textTexture");
    textMaterial.map = textTexture;

    const font = this.engine.resources.getItem("textFont");
    for (let i = 0; i < TEXT.length; i++) {
      const strArr = TEXT[i].split("");
      const obj = new THREE.Object3D();
      let y = THREE.MathUtils.randFloat(0, 20);
      let x = THREE.MathUtils.randFloat(-50, 50);
      let z = THREE.MathUtils.randFloat(-50, 50);
      for (let j = 0; j < strArr.length; j++) {
        const textGeometry = createTextGeometry(strArr[j], {
          font,
          size: fontSize,
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.x = x;
        textMesh.position.y = y;
        textMesh.position.z = z;
        y += fontSize + fontSize / 2;
        obj.add(textMesh);
        this.objects.push(obj);
      }
      this.engine.scene.add(obj);
    }
  }

  resize() {}

  update() {
    for (const obj of this.objects) {
      obj.position.z += 0.1;
      if (obj.position.z > maxCameraDistance) {
        obj.position.z = -50;
        obj.position.x = THREE.MathUtils.randFloat(-50, 50);
        obj.position.y = THREE.MathUtils.randFloat(0, 50);
      }
    }
  }
}
