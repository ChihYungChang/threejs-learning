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
    this.createParticles.createText("123456你好啊!");
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
      textSize: 5,
      area: 1,
      ease: 0.05,
    };

    this.particleGeoList = [];

    this.rate = 1000;

    this.bindEvents();
  }

  setup() {}

  bindEvents() {
    window.addEventListener("click", () => {
      this.rate = this.rate == 100 ? 0 : 100;
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

          const initVec = new THREE.Vector3(initX, initY, 0);
          const posVec = new THREE.Vector3(
            px + random(-this.rate, this.rate),
            py + random(-this.rate, this.rate),
            0
          );
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

  createText(text) {
    const textArr = text.replace(/ /gi, "").split("");

    const dataList = [];

    let yOffset = 0;
    for (let text of textArr) {
      let shapes = this.font.generateShapes(text, this.data.textSize);
      let geometry = new THREE.ShapeGeometry(shapes);
      geometry.center();
      geometry.computeBoundingBox();
      const textHeight =
        (geometry.boundingBox.max.y - geometry.boundingBox.min.y) / 2.85;
      dataList.push({ geometry, shapes, textHeight });
      yOffset += textHeight;
    }

    const allGeoParticles = [];
    let y = yOffset / 2;
    for (const { geometry, shapes, textHeight } of dataList) {
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
          randomPoints.push(element.x, element.y, 0);
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
        color: { value: new THREE.Color(0xffffff) },
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

  distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }
}
