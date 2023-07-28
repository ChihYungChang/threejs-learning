import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: "tiger",
      path: "./models/fbx/tiger.fbx",
      type: "fbx",
    },
  ];

  texArr: Array<THREE.Texture> = [];

  t = 0;

  mesh: THREE.Mesh | undefined = undefined;

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 2;
    engine.camera.instance.position.y = 2;
    engine.camera.instance.position.x = 2;
  }

  init() {
    // 创建一个三维坐标轴
    const axesHelper = new THREE.AxesHelper(10);
    this.engine.scene.add(axesHelper);

    // 添加环境光
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 1));

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    this.engine.scene.add(mesh);

    this.mesh = mesh;

    let textureLoader = new THREE.TextureLoader();
    for (let i = 0; i < 75; i++) {
      const frameIndex = String(i).padStart(5, "0");
      const texture = textureLoader.load(
        `./texture/blackhole/黑洞_${frameIndex}.png`
      );
      this.texArr.push(texture);
    }

    console.log(this.texArr);
  }

  resize() {}

  update(time: number) {
    this.t += 0.1;
    if (this.t > 75) this.t = 0;
    if (this.mesh) {
      //@ts-ignore
      this.mesh.material.map = this.texArr[Math.floor(this.t)];
      //@ts-ignore
      this.mesh.material.needsUpdate = true;
    }
  }
}
