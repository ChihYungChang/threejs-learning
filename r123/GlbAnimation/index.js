//===================================================== canvas
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 1.5;

//===================================================== lights
var light = new THREE.DirectionalLight(0xefefff, 3);
light.position.set(1, 1, 1).normalize();
scene.add(light);
var light = new THREE.DirectionalLight(0xffefef, 3);
light.position.set(-1, -1, -1).normalize();
scene.add(light);

//===================================================== resize
window.addEventListener("resize", function () {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

//===================================================== model
var loader = new THREE.GLTFLoader();
var mixer;
var model;
loader.load("../../lib/model/glb/text-wrapping.glb", function (gltf) {
  gltf.scene.traverse(function (node) {
    if (node instanceof THREE.Mesh) {
      node.castShadow = true;
      node.material.side = THREE.DoubleSide;
    }
  });

  model = gltf.scene;
  model.scale.set(1, 1, 1);
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  mixer.clipAction(gltf.animations[0]).play();
});

var clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  if (mixer != null) mixer.update(delta);
 
  renderer.render(scene, camera);
}

render();
