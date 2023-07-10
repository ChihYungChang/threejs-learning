import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: "fbxTiger",
      path: "./models/fbx/Tiger222.fbx",
      type: "fbx",
    },
  ];

  mixer: THREE.AnimationMixer | undefined;

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 250;
    engine.camera.instance.position.y = 100;
    engine.camera.instance.position.x = 100;
  }

  init() {
    // 创建一个三维坐标轴
    const axesHelper = new THREE.AxesHelper(200);
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

    // const tiger: GLTF = this.engine.resources.getItem("tiger");
    // const texture = this.engine.resources.getItem("texture");
    // let tigerTextureMaterial = new THREE.MeshStandardMaterial({
    //   map: texture,
    //   metalness: 0.2,
    //   roughness: 0.07,
    //   side: THREE.DoubleSide,
    // });
    // tiger.scene.traverse((node) => {
    //   if (node instanceof THREE.Mesh) {
    //     node.material = tigerTextureMaterial;
    //     node.material.side = THREE.DoubleSide;
    //     node.material.castShadow = true;
    //     node.castShadow = true;
    //     node.receiveShadow = true;
    //     node.geometry.computeVertexNormals(); // 解决方案
    //   }
    // });
    // this.engine.scene.add(tiger.scene);

    const fbxTiger: THREE.Group = this.engine.resources.getItem("fbxTiger");

    //设置模型的每个部位都可以投影
    fbxTiger.traverse(function (child) {
      if ((child as any).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    this.mixer = new THREE.AnimationMixer(fbxTiger);
    const action = this.mixer.clipAction(fbxTiger.animations[5]);
    action.play();
    this.engine.scene.add(fbxTiger);
  }

  resize() {}

  update() {
    if (this.mixer) {
      this.mixer.update(0.01);
    }
  }
}
