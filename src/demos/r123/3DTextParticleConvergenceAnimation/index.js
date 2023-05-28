import * as THREE from "three";
import { random } from "three/addons/utils/CommonUtils.js";

const preload = () => {
  let manager = new THREE.LoadingManager();
  manager.onLoad = function () {
    const environment = new Environment(typo, particle);
  };

  var typo = null;
  const loader = new THREE.FontLoader(manager);
  loader.load(
    "../../lib/fonts/Alibaba PuHuiTi 2.0 115 Black_Regular.json",
    function (font) {
      typo = font;
    }
  );
  const particle = new THREE.TextureLoader(manager).load(
    "https://res.cloudinary.com/dfvtkoboz/image/upload/v1605013866/particle_a64uzf.png"
  );
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
)
  preload();
else document.addEventListener("DOMContentLoaded", preload);

class Environment {
  constructor(font, particle) {
    this.font = font;
    this.particle = particle;
    this.container = document.querySelector("#magic");
    this.scene = new THREE.Scene();
    this.createCamera();
    this.createRenderer();
    this.setup();
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  setup() {
    this.createParticles = new CreateParticles(
      { scene: this.scene, camera: this.camera, renderer: this.renderer },
      this.font,
      this.particle
    );
    this.createParticles.createText("你好啊");
  }

  render() {
    this.createParticles.render();
    this.renderer.render(this.scene, this.camera);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      65,
      this.container.clientWidth / this.container.clientHeight,
      1,
      10000
    );
    this.camera.position.set(0, 0, 100);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.container.appendChild(this.renderer.domElement);

    this.renderer.setAnimationLoop(() => {
      this.render();
    });
  }

  onWindowResize() {
    this.camera.aspect =
      this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
  }
}

class CreateParticles {
  constructor({ scene, camera, renderer }, font, particleImg) {
    this.scene = scene;
    this.font = font;
    this.particleImg = particleImg;
    this.camera = camera;
    this.renderer = renderer;
    this.colorChange = new THREE.Color();

    this.data = {
      text: `1`,
      amount: 200,
      particleSize: 1,
      particleColor: 0xffffff,
      textSize: 10,
      area: 1,
      ease: 0.05,
    };

    this.particleGeoList = [];

    this.rate = 1000;

    this.textMeshList = [];

    this.bindEvents();
  }

  setup() {}

  bindEvents() {
    window.addEventListener("click", () => {
      this.rate = this.rate == 1000 ? 0 : 1000;
    });
  }

  render(level) {
    const time = ((0.001 * performance.now()) % 12) / 12;
    const zigzagTime = (1 + Math.sin(time * 2 * Math.PI)) / 6;

    if (this.particleGeoList) {
      for (const { particles, geometryCopy } of this.particleGeoList) {
        const pos = particles.geometry.attributes.position;
        const copy = geometryCopy.attributes.position;
        const coulors = particles.geometry.attributes.customColor;
        const randomPosition = particles.geometry.attributes.randomPosition;
        const size = particles.geometry.attributes.size;

        for (var i = 0, l = pos.count; i < l; i++) {
          // 初始位置
          const initX = copy.getX(i);
          const initY = copy.getY(i);
          const initZ = copy.getZ(i);
          // 随机位置
          const randomX = randomPosition.getX(i);
          const randomY = randomPosition.getY(i);
          const randomZ = randomPosition.getZ(i);

          // 当前例子位置
          let px = pos.getX(i);
          let py = pos.getY(i);
          let pz = pos.getZ(i);

          this.colorChange.setHSL(0.5, 1, 1);
          coulors.setXYZ(
            i,
            this.colorChange.r,
            this.colorChange.g,
            this.colorChange.b
          );
          coulors.needsUpdate = true;

          this.colorChange.setHSL(0.5, 1, 1);
          coulors.setXYZ(
            i,
            this.colorChange.r,
            this.colorChange.g,
            this.colorChange.b
          );
          coulors.needsUpdate = true;

          size.array[i] = this.data.particleSize;
          size.needsUpdate = true;

          // 更新位置逻辑

          const initVec = new THREE.Vector3(initX, initY, initZ);
          const posVec = new THREE.Vector3(px, py, pz);
          const randomVec = new THREE.Vector3(randomX, randomY, randomZ);
          if (this.rate === 1000) {
            posVec.add(randomVec);
          }
          const d = new THREE.Vector3(0, 0, 0).subVectors(initVec, posVec);

          // px += (initX - px) * this.data.ease;
          // py += (initY - py) * this.data.ease;
          // pz += (initZ - pz) * this.data.ease;
          px += d.x * this.data.ease;
          py += d.y * this.data.ease;
          pz += d.z * this.data.ease;

          pos.setXYZ(i, px, py, pz);
          pos.needsUpdate = true;
        }
      }
    }
  }

  /**
   * 初始化文字，获取文字数据
   * @param {*} text
   * @returns
   */
  initText(text) {
    const textArr = text.replace(/ /gi, "").split("");

    const generateParticleData = [];
    let yOffset = 0;
    for (let text of textArr) {
      let shapes = this.font.generateShapes(text, this.data.textSize);
      let geometry = new THREE.ShapeGeometry(shapes);
      geometry.center();
      geometry.computeBoundingBox();
      const textHeight = geometry.boundingBox.max.y;
      generateParticleData.push({ geometry, shapes, textHeight });

      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xf10000,
        transparent: true,
        opacity: 0,
      });
      const textMesh = new THREE.Mesh(geometry, textMaterial);
      textMesh.position.y = yOffset;
      yOffset += geometry.boundingBox.max.y + this.data.textSize;
    }

    return {
      yOffset,
      generateParticleData,
    };
  }

  createText(text) {
    const { generateParticleData, yOffset } = this.initText(text);

    const allGeoParticles = [];
    let y = yOffset / 2;
    for (const { geometry, shapes, textHeight } of generateParticleData) {
      let thePoints = [];
      const randomPoints = [];
      geometry.computeBoundingBox();
      let holeShapes = [];

      for (let q = 0; q < shapes.length; q++) {
        let shape = shapes[q];

        if (shape.holes && shape.holes.length > 0) {
          for (let j = 0; j < shape.holes.length; j++) {
            let hole = shape.holes[j];
            holeShapes.push(hole);
          }
        }
      }
      shapes.push.apply(shapes, holeShapes);

      let colors = [];
      let sizes = [];

      for (let x = 0; x < shapes.length; x++) {
        let shape = shapes[x];

        const amountPoints =
          shape.type == "Path" ? this.data.amount / 2 : this.data.amount;

        let points = shape.getSpacedPoints(amountPoints);

        points.forEach((element, z) => {
          const a = new THREE.Vector3(element.x, element.y, 0);
          thePoints.push(a);
          randomPoints.push(
            random(-100, 100),
            random(-100, 100),
            random(-2000, 0)
          );
          colors.push(
            this.colorChange.r,
            this.colorChange.g,
            this.colorChange.b
          );
          sizes.push(1);
        });
      }

      let geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints);
      geoParticles.translate(0, y, 0);

      y -= this.data.textSize + textHeight;

      geoParticles.setAttribute(
        "customColor",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      geoParticles.setAttribute(
        "randomPosition",
        new THREE.Float32BufferAttribute(randomPoints, 3)
      );
      geoParticles.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(sizes, 1)
      );

      allGeoParticles.push(geoParticles);
    }

    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0xf10000) },
        pointTexture: { value: this.particleImg },
      },
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,

      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
    });

    for (const geo of allGeoParticles) {
      const particles = new THREE.Points(geo, material);
      this.scene.add(particles);

      const geometryCopy = new THREE.BufferGeometry();
      geometryCopy.copy(particles.geometry);

      this.particleGeoList.push({
        particles,
        geometryCopy,
      });
    }
  }

  // createTextObject(textMeshList, yOffset) {
  //   const boderYOffset = textMeshList.length * 0.3;
  //   let _yOffset = yOffset / 2 - boderYOffset;
  //   let _totalHeight = boderYOffset * 2;
  //   for (const textMesh of textMeshList) {
  //     const geo = textMesh.geometry;
  //     textMesh.position.y = _yOffset;
  //     textMesh.position.z = 6;
  //     // cubeMesh.add(textMesh);
  //     this.scene.add(textMesh);
  //     const _textHeight = geo.boundingBox.max.y;
  //     _totalHeight += this.data.textSize + _textHeight;
  //     _yOffset -= this.data.textSize + _textHeight;
  //   }

  //   const rate = 192 / 1150;
  //   // 创建立方体
  //   const geometry = new THREE.BoxGeometry(
  //     _totalHeight * rate,
  //     _totalHeight,
  //     10
  //   );
  //   geometry.center();
  //   geometry.computeBoundingBox();
  //   const textureLoader = new THREE.TextureLoader();
  //   const texture = textureLoader.load("./texture.png"); // 替换为你的图片路径
  //   const material = new THREE.MeshBasicMaterial({
  //     color: 0xffffff,
  //     map: texture,
  //     transparent: true,
  //     opacity: 0,
  //   });
  //   const cubeMesh = new THREE.Mesh(geometry, material);
  //   cubeMesh.position.y = 0;
  //   cubeMesh.position.x = 0;
  //   cubeMesh.position.z = 0;
  //   cubeMesh.add;
  //   this.scene.add(cubeMesh);
  //   this.cubeMesh = cubeMesh;
  // }

  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
}
