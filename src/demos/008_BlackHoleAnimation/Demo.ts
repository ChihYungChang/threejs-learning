import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: "ship",
      path: "./models/fbx/ship.fbx",
      type: "fbx",
    },
    {
      name: "BaseColor",
      path: "./texture/ship/BaseColor.png",
      type: "texture",
    },
    {
      name: "Normal",
      path: "./texture/ship/Normal.png",
      type: "texture",
    },
    {
      name: "OcclusionRoughnessMetallic",
      path: "./texture/ship/OcclusionRoughnessMetallic.png",
      type: "texture",
    },
  ];

  texArr: Array<THREE.Texture> = [];

  t = 0;

  mesh: any = undefined;

  ship: THREE.Object3D | undefined = undefined;

  mixer: THREE.AnimationMixer | undefined;

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 5;
    engine.camera.instance.position.y = 5;
    engine.camera.instance.position.x = 5;

    // engine.scene.background = new THREE.Color("#070729");
  }

  init() {
    // 创建一个三维坐标轴
    // const axesHelper = new THREE.AxesHelper(10);
    // this.engine.scene.add(axesHelper);

    // 添加环境光
    // this.engine.scene.add(new THREE.AmbientLight(0xffffff, 1));

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.castShadow = true;
    directionalLight.position.set(2, 10, 2);

    this.engine.scene.add(directionalLight);

    // 黑洞
    const geometry = new THREE.PlaneGeometry(18, 18);
    const material = new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.mesh = mesh;
    // 应用材质到模型网格
    mesh.material = material;
    this.engine.scene.add(mesh);

    // 遮挡物
    const boxGeo = new THREE.BoxGeometry(12, 12, 12);
    const hiderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    hiderMaterial.colorWrite = false;
    const boxMesh = new THREE.Mesh(boxGeo, hiderMaterial);
    boxMesh.position.set(0, 0, -6.1);
    this.engine.scene.add(boxMesh);

    let textureLoader = new THREE.TextureLoader();
    for (let i = 0; i < 75; i++) {
      const frameIndex = String(i).padStart(5, "0");
      const texture = textureLoader.load(
        `./texture/blackhole/黑洞_${frameIndex}.png`
      );
      this.texArr.push(texture);
    }

    const ship = this.engine.resources.getItem("ship");
    const baseColorMap = this.engine.resources.getItem("BaseColor");
    const normalMap = this.engine.resources.getItem("Normal");
    const aoRoughMetalMap = this.engine.resources.getItem(
      "OcclusionRoughnessMetallic"
    );
    const shipBasicMaterial = new THREE.MeshStandardMaterial({
      color: 0x635b5b,
      metalness: 0.9,
      roughness: 0.5,
      aoMap: aoRoughMetalMap,
    });
    const shipPhongMaterial = new THREE.MeshPhongMaterial({
      map: baseColorMap,
      normalMap: normalMap,
      // aoMap: aoRoughMetalMap,
      shininess: 100,
      // emissive: 0xffffff,
      // emissiveIntensity: 0.1,
      depthTest: true,
      specular: 0xffffff,
    });

    ship.children[1].children[0].material = shipBasicMaterial;
    ship.children[1].children[0].needsUpdate = true;
    ship.children[1].children[1].material = shipBasicMaterial;
    ship.children[1].children[1].needsUpdate = true;
    ship.children[1].children[2].material = shipPhongMaterial;
    ship.children[1].children[2].needsUpdate = true;

    ship.scale.set(0.001, 0.001, 0.001);
    this.ship = ship;
    this.engine.scene.add(ship);

    this.mixer = new THREE.AnimationMixer(ship);

    // 创建动画轨道的动作（AnimationAction）
    const action = this.mixer?.clipAction(ship.animations[0]);

    // 循环播放动画
    action?.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action?.play();
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

    if (this.mixer) {
      this.mixer.update(time);
    }
  }
}
