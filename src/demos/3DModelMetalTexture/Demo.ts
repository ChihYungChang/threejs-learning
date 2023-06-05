import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: "ren",
      path: "./models/gltf/ren.glb",
      type: "gltf",
    },
    {
      name: "shan",
      path: "./models/gltf/shan.glb",
      type: "gltf",
    },
    {
      name: "mountain-people",
      path: "./models/gltf/mountain-people.glb",
      type: "gltf",
    },
  ];

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 1;
    engine.camera.instance.position.y = 0.2;
  }

  init() {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;

    this.engine.scene.add(plane);

    // 创建一个三维坐标轴
    const axesHelper = new THREE.AxesHelper(150);
    this.engine.scene.add(axesHelper);

    // 添加环境光
    this.engine.scene.add(new THREE.AmbientLight(0xffffff, 9));

    // 为场景添加平行光
    const directionalLight = new THREE.DirectionalLight(0xfffee8, 12);
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    this.engine.scene.add(directionalLight);
    // 创建平行光可视化工具
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    );
    this.engine.scene.add(directionalLightHelper);

    // const mountainPeople: GLTF =
    //   this.engine.resources.getItem("mountain-people");
    const ren: GLTF = this.engine.resources.getItem("ren");
    const shan: GLTF = this.engine.resources.getItem("shan");
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x4e422d, // 设置颜色
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      metalness: 0.9,
      roughness: 0.5,
      opacity: 1,
      transparent: true,
      normalScale: new THREE.Vector2(0.1, 0.1),
    });

    ren.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material = material;
        node.material.side = THREE.DoubleSide;
        node.material.castShadow = true;
        node.castShadow = true;
        node.receiveShadow = true;
        node.geometry.computeVertexNormals(); // 解决方案
      }
    });
    shan.scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        node.material = material;
        node.material.side = THREE.DoubleSide;
        node.material.castShadow = true;
        node.castShadow = true;
        node.receiveShadow = true;
        node.geometry.computeVertexNormals(); // 解决方案
      }
    });
    // mountainPeople.scene.traverse((node) => {
    //   if (node instanceof THREE.Mesh) {
    //     node.material = material;
    //     node.material.side = THREE.DoubleSide;
    //     node.material.castShadow = false;
    //     node.castShadow = true;
    //     node.receiveShadow = true;
    //     node.geometry.computeVertexNormals(); // 解决方案
    //   }
    // });

    ren.scene.position.y = 0.27;
    shan.scene.position.y = 0.27;
    // mountainPeople.scene.position.y = 0.27;
    this.engine.scene.add(ren.scene);
    this.engine.scene.add(shan.scene);
    // this.engine.scene.add(mountainPeople.scene);
  }

  resize() {}

  update() {}
}
