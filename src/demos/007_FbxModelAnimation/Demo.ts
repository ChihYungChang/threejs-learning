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

  mixer: THREE.AnimationMixer | undefined;

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

    // 为场景添加平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    directionalLight.castShadow = true;
    this.engine.scene.add(directionalLight);

    // 创建平行光可视化工具
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    );
    this.engine.scene.add(directionalLightHelper);

    // FBX
    const tiger = this.engine.resources.getItem("tiger");

    // 遍历模型的子网格（submeshes）
    tiger.traverse((child: any) => {
      if (child.isMesh) {
        child.material.side = THREE.DoubleSide;
        child.material.alphaTest = 0.2;
        child.material.transparent = false;
        child.material.needsUpdate = true;
      }
    });
    this.engine.scene.add(tiger);

    this.mixer = new THREE.AnimationMixer(tiger);

    // 遍历模型的所有动画轨道
    console.log(tiger.animations);

    // 创建动画轨道的动作（AnimationAction）
    const action = this.mixer?.clipAction(tiger.animations[0]);

    // 循环播放动画
    action?.setLoop(THREE.LoopRepeat, 10);
    action?.play();
  }

  resize() {}

  update(time: number) {
    if (this.mixer) {
      this.mixer.update(time);
    }
  }
}
