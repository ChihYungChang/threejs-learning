import { Engine } from "../../engine/Engine";
import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { Experience } from "../../engine/Experience";
import { Resource } from "../../engine/Resources";

export class Demo implements Experience {
  resources: Resource[] = [
    {
      name: "texture",
      path: "./texture/particle.jpg",
      type: "texture",
    },
  ];

  particleSystem: THREE.Points<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.PointsMaterial
  > | null = null;

  particles: THREE.Points<
    THREE.BufferGeometry<THREE.NormalBufferAttributes>,
    THREE.PointsMaterial
  > | null = null;

  constructor(private engine: Engine) {
    engine.camera.instance.position.z = 7;
    engine.camera.instance.position.y = 0.2;
    engine.camera.instance.position.x = 0.2;
  }

  init() {
    // 创建一个三维坐标轴
    const axesHelper = new THREE.AxesHelper(150);
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

    this.createParticleAnimation1();
    this.createParticleAnimation2();
  }

  createParticleAnimation1() {
    // 创建粒子
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 3) {
      positions[i] = THREE.MathUtils.randFloat(-4, 4);
      positions[i + 1] = THREE.MathUtils.randFloat(-4, 4);
      positions[i + 2] = THREE.MathUtils.randFloat(5, 10);

      colors[i] = 253;
      colors[i + 1] = 253;
      colors[i + 2] = 0.2;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    const particleTexture = this.engine.resources.getItem("texture");
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      map: particleTexture,
      alphaMap: particleTexture,
      alphaTest: 0.001,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(particlesGeometry, pointMaterial);

    this.particles = particles;
    this.engine.scene.add(particles);

    const particleStartPositions = particlesGeometry.getAttribute("position");
    for (let i = 0; i < particleStartPositions.count; i++) {
      const tween = new TWEEN.Tween(positions);
      tween.to(
        {
          [i * 3]: 0,
          [i * 3 + 1]: 0,
          [i * 3 + 2]: 0,
        },
        5000 * Math.random()
      );

      tween.easing(TWEEN.Easing.Exponential.In);
      tween.delay(2000);
      tween.onUpdate(() => {
        particleStartPositions.needsUpdate = true;
      });

      tween.start();
    }
  }

  createParticleAnimation2() {
    // 创建粒子系统
    const particleCount = 2000; // 粒子数量
    const particles = new THREE.BufferGeometry();
    const particleTexture = this.engine.resources.getItem("texture");
    const pointMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      map: particleTexture,
      alphaMap: particleTexture,
      alphaTest: 0.001,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });

    const cubeWidth = 0.5;
    const cubeHeight = 2;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * cubeWidth;

      // 根据圆柱体的位置、半径和高度计算粒子的位置
      const x = Math.cos(angle) * radius;
      const y = THREE.MathUtils.randFloat(-cubeHeight / 2, cubeHeight / 2);
      const z = Math.sin(angle) * radius;

      positions[i] = x;
      positions[i + 1] = y;
      positions[i + 2] = z;

      colors[i] = 253;
      colors[i + 1] = 253;
      colors[i + 2] = 0.2;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 创建粒子系统对象
    const initVec = new THREE.Vector3(0, 0, 0);
    const particleSystem = new THREE.Points(particles, pointMaterial);
    particleSystem.position.copy(initVec);
    this.engine.scene.add(particleSystem);
    this.particleSystem = particleSystem;

    const tween = new TWEEN.Tween(pointMaterial);
    tween
      .to({ opacity: 1 }, 4 * 1000)
      .delay(2000)
      .onUpdate(() => {
        pointMaterial.needsUpdate = true;
      })
      .onComplete(() => {
        const tweenOut = new TWEEN.Tween(pointMaterial)
          .to({ opacity: 0 }, 2 * 1000)
          .onUpdate(() => {
            pointMaterial.needsUpdate = true;
          })
          .onComplete(() => {
            this.engine.scene.remove(particleSystem);
            if (this.particles) {
              this.engine.scene.remove(this.particles);
            }
          });

        tweenOut.start();
      });
    tween.start();
  }

  resize() {}

  update() {
    TWEEN.update();

    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.2;
    }
  }
}
