import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: "ship",
      path: "./models/fbx/ship2.fbx",
      type: "fbx",
    },
    {
      name: "space",
      path: "./texture/space.png",
      type: "texture",
    },
    {
      name: "BaseColor1",
      path: "./texture/ship/BaseColor1.png",
      type: "texture",
    },
    {
      name: "BaseColor2",
      path: "./texture/ship/BaseColor2.png",
      type: "texture",
    },
    {
      name: "BaseColor3",
      path: "./texture/ship/BaseColor3.png",
      type: "texture",
    },
    {
      name: "Normal1",
      path: "./texture/ship/Normal1.png",
      type: "texture",
    },
    {
      name: "Normal2",
      path: "./texture/ship/Normal2.png",
      type: "texture",
    },
    {
      name: "Normal3",
      path: "./texture/ship/Normal3.png",
      type: "texture",
    },
    {
      name: "Metalness1",
      path: "./texture/ship/Metalness1.png",
      type: "texture",
    },
    {
      name: "Metalness2",
      path: "./texture/ship/Metalness2.png",
      type: "texture",
    },
    {
      name: "Metalness3",
      path: "./texture/ship/Metalness3.png",
      type: "texture",
    },
    {
      name: "Roughness1",
      path: "./texture/ship/Roughness1.png",
      type: "texture",
    },
    {
      name: "Roughness2",
      path: "./texture/ship/Roughness2.png",
      type: "texture",
    },
    {
      name: "Roughness3",
      path: "./texture/ship/Roughness3.png",
      type: "texture",
    },
    {
      name: "Light1",
      path: "./texture/ship/Light1.png",
      type: "texture",
    },
    {
      name: "Light2",
      path: "./texture/ship/Light2.png",
      type: "texture",
    },
    {
      name: "Light3",
      path: "./texture/ship/Light3.png",
      type: "texture",
    },
  ];

  texArr: Array<THREE.Texture> = [];

  t = 0;

  mesh: any = undefined;

  ship: THREE.Object3D | undefined = undefined;

  mixer: THREE.AnimationMixer | undefined;

  haloMaterial: THREE.ShaderMaterial | undefined = undefined;

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 30;
    engine.camera.instance.position.y = -8;
    engine.camera.instance.position.x = -10;
  }

  init() {
    // 创建一个三维坐标轴
    const axesHelper = new THREE.AxesHelper(100);
    this.engine.scene.add(axesHelper);

    // 添加环境光
    // this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.03));

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.castShadow = true;
    directionalLight.position.set(3, 5, 3);
    this.engine.scene.add(directionalLight);

    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight2.castShadow = true;
    directionalLight2.position.set(-10, 0, 20);
    directionalLight2.lookAt(0, 0, 20);
    this.engine.scene.add(directionalLight2);

    const DirectionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      3
    );
    this.engine.scene.add(DirectionalLightHelper);

    const DirectionalLightHelper2 = new THREE.DirectionalLightHelper(
      directionalLight2,
      3
    );
    this.engine.scene.add(DirectionalLightHelper2);

    const ship = this.engine.resources.getItem("ship");
    const baseColorMap1 = this.engine.resources.getItem("BaseColor1");
    const normalMap1 = this.engine.resources.getItem("Normal1");
    const MetalnessMap1 = this.engine.resources.getItem("Metalness1");
    const RoughnessMap1 = this.engine.resources.getItem("Roughness1");
    const LightMap1 = this.engine.resources.getItem("Light1");

    const baseColorMap2 = this.engine.resources.getItem("BaseColor2");
    const normalMap2 = this.engine.resources.getItem("Normal2");
    const MetalnessMap2 = this.engine.resources.getItem("Metalness2");
    const RoughnessMap2 = this.engine.resources.getItem("Roughness2");
    const LightMap2 = this.engine.resources.getItem("Light2");

    const baseColorMap3 = this.engine.resources.getItem("BaseColor3");
    const normalMap3 = this.engine.resources.getItem("Normal3");
    const MetalnessMap3 = this.engine.resources.getItem("Metalness3");
    const RoughnessMap3 = this.engine.resources.getItem("Roughness3");
    const LightMap3 = this.engine.resources.getItem("Light3");

    // 天空盒
    const skyGeo = new THREE.SphereGeometry(1000, 25, 25);
    const skyMaterial = new THREE.MeshPhongMaterial({
      map: this.engine.resources.getItem("space"),
      toneMapped: true,
      // transparent: true,
      // opacity: 1,
    });
    const skyBox = new THREE.Mesh(skyGeo, skyMaterial);
    skyBox.material.side = THREE.BackSide;
    skyBox.visible = true;
    this.engine.scene.add(skyBox);

    // 材质球
    const shaderGeo = new THREE.SphereGeometry(5, 25, 25);
    const shaderMaterial = new THREE.MeshPhysicalMaterial({
      map: baseColorMap1,
      normalMap: normalMap1,
      metalnessMap: MetalnessMap1,
      roughnessMap: RoughnessMap1,
      lightMapIntensity: 0.2,
      lightMap: LightMap1,
      metalness: 0.9, // 设置金属度，取值范围为 0 到 1
      roughness: 0.9, // 设置粗糙度，取值范围为 0 到 1
      normalScale: new THREE.Vector2(0.2, 0.2),
      depthTest: true,
      side: THREE.DoubleSide,
    });
    const shaderBox = new THREE.Mesh(shaderGeo, shaderMaterial);
    shaderBox.position.set(0, 5, 0);
    shaderBox.visible = true;
    this.engine.scene.add(shaderBox);

    // // 黑洞
    // const geometry = new THREE.PlaneGeometry(18, 18);
    // const material = new THREE.MeshLambertMaterial({
    //   side: THREE.DoubleSide,
    //   transparent: true,
    // });
    // const mesh = new THREE.Mesh(geometry, material);
    // this.mesh = mesh;
    // // 应用材质到模型网格
    // mesh.material = material;
    // this.engine.scene.add(mesh);

    // // 遮挡物
    // const boxGeo = new THREE.BoxGeometry(12, 12, 12);
    // const hiderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    // hiderMaterial.colorWrite = false;
    // const boxMesh = new THREE.Mesh(boxGeo, hiderMaterial);
    // boxMesh.position.set(0, 0, -6.1);
    // this.engine.scene.add(boxMesh);

    let textureLoader = new THREE.TextureLoader();
    for (let i = 0; i < 75; i++) {
      const frameIndex = String(i).padStart(5, "0");
      const texture = textureLoader.load(
        `./texture/blackhole/黑洞_${frameIndex}.png`
      );
      this.texArr.push(texture);
    }

    // 顶点着色器代码
    const vertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;


void main() {
   vNormal = normal;
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = viewPosition.xyz;
  gl_Position = projectionMatrix * viewPosition;
}
`;

    // 片元着色器代码
    const fragmentShader = `
varying vec3 vNormal;
uniform vec3 cameraDirection; // 相机视线方向

void main() {
  // 计算顶点法线与视线方向的点积
  float dotProduct = dot(normalize(vNormal), normalize(cameraDirection));

  // 控制光晕的强度，修复为非负值
  float haloStrength = max(1.0, 1.0 - dotProduct);

  // 控制辉光的强度和颜色，这里使用 vec3(0.0, 1.0, 0.0) 表示绿色荧光
  vec3 glowColor = vec3(0.0, 1.0, 0.0);
  vec3 glowingColor = glowColor * 1.5 * haloStrength;

  // 将辉光效果与原颜色进行混合
  gl_FragColor = vec4(glowingColor, 1.0);
}`;

    // 创建 ShaderMaterial，使用自定义的着色器代码
    const bloomMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        cameraDirection: { value: new THREE.Vector3() }, // 初始化相机视线方向为零向量
      },
    });
    this.haloMaterial = bloomMaterial;

    const shipBasicMaterial = new THREE.MeshPhongMaterial({
      color: 0x3af278,
      specular: 0xffffff,
      shininess: 100,
      emissive: 0xadff0a,
      emissiveIntensity: 1,
      depthTest: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const shipPhongMaterial1 = new THREE.MeshPhysicalMaterial({
      map: baseColorMap1,
      normalMap: normalMap1,
      metalnessMap: MetalnessMap1,
      roughnessMap: RoughnessMap1,
      lightMapIntensity: 0.2,
      lightMap: LightMap1,
      metalness: 0.9, // 设置金属度，取值范围为 0 到 1
      roughness: 0.9, // 设置粗糙度，取值范围为 0 到 1
      normalScale: new THREE.Vector2(0.2, 0.2),
      depthTest: true,
      side: THREE.DoubleSide,
    });

    const shipPhongMaterial2 = new THREE.MeshPhysicalMaterial({
      map: baseColorMap2,
      normalMap: normalMap2,
      metalnessMap: MetalnessMap2,
      roughnessMap: RoughnessMap2,
      lightMapIntensity: 0.2,
      lightMap: LightMap2,
      metalness: 0.9, // 设置金属度，取值范围为 0 到 1
      roughness: 0.9, // 设置粗糙度，取值范围为 0 到 1
      normalScale: new THREE.Vector2(0.2, 0.2),
      depthTest: true,
      side: THREE.DoubleSide,
    });

    const shipPhongMaterial3 = new THREE.MeshPhysicalMaterial({
      map: baseColorMap3,
      normalMap: normalMap3,
      metalnessMap: MetalnessMap3,
      roughnessMap: RoughnessMap3,
      lightMapIntensity: 0.2,
      lightMap: LightMap3,
      metalness: 0.9, // 设置金属度，取值范围为 0 到 1
      roughness: 0.9, // 设置粗糙度，取值范围为 0 到 1
      normalScale: new THREE.Vector2(0.2, 0.2),
      depthTest: true,
      side: THREE.DoubleSide,
    });

    ship.children[1].children[0].material = shipBasicMaterial;
    ship.children[1].children[0].needsUpdate = true;

    ship.children[1].children[1].material = shipPhongMaterial1;
    ship.children[1].children[1].needsUpdate = true;

    ship.children[1].children[2].material = shipPhongMaterial2;
    ship.children[1].children[2].needsUpdate = true;

    ship.children[1].children[3].material = shipPhongMaterial1;
    ship.children[1].children[3].needsUpdate = true;

    ship.scale.set(0.001, 0.001, 0.001);
    this.ship = ship;

    this.engine.camera.instance.lookAt(ship);
    this.engine.scene.add(ship);

    this.mixer = new THREE.AnimationMixer(ship);

    // 创建动画轨道的动作（AnimationAction）
    const action = this.mixer?.clipAction(ship.animations[0]);

    // 循环播放动画
    action?.setLoop(THREE.LoopRepeat, 100);
    action?.play();
  }

  resize() {}

  update(time: number) {
    this.t += 0.13;
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

    // 更新相机的视线方向
    const cameraDirection = new THREE.Vector3();
    this.engine.camera.instance.getWorldDirection(cameraDirection);

    // 更新相机视线方向为相机的方向向量
    this.haloMaterial?.uniforms.cameraDirection.value.copy(
      this.engine.camera.instance.getWorldDirection(cameraDirection)
    );
  }
}
