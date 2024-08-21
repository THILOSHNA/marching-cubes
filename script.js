import * as THREE from "//unpkg.com/three@0.164.0/build/three.module";
import { MarchingCubes } from "//unpkg.com/three@0.164.0/examples/jsm/objects/MarchingCubes.js";
import { OrbitControls } from "//unpkg.com/three@0.164.0/examples/jsm/controls/OrbitControls.js";
import Stats from "//unpkg.com/three@0.164.0/examples/jsm/libs/stats.module";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 0, 350);
camera.lookAt(new THREE.Vector3(0, 0, 0));
controls.update();

const stats = new Stats();
stats.domElement.style.position = "absolute";
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(0.5, 0.5, 1);
scene.add(light);

// const directionalLightHelper = new THREE.DirectionalLightHelper(light, 45);
// scene.add(directionalLightHelper);

let resolution = 48;

const effect = new MarchingCubes(
  resolution,
  new THREE.MeshPhongMaterial({
    color: 0x38a1db,
    specular: 0xffffff,
    shininess: 5,
  }),
  true,
  true,
  100000
);
effect.scale.set(70, 70, 70);
effect.position.x = 10;
effect.enableUvs = false;
effect.enableColors = false;
effect.isolation = 100;

scene.add(effect);

function updateCubes(object, time, numblobs, floor, wallx, wallz) {
  object.reset();

  const subtract = 12;
  const strength = 1.2 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

  for (let i = 0; i < numblobs; i++) {
    const ballx =
      Math.sin(i + 1.26 * time * (1.03 + 0.5 * Math.cos(0.21 * i))) * 0.27 +
      0.5;
    const bally =
      Math.abs(Math.cos(i + 1.12 * time * Math.cos(1.22 + 0.1424 * i))) * 0.77;
    const ballz =
      Math.cos(i + 1.32 * time * 0.1 * Math.sin(0.92 + 0.53 * i)) * 0.27 + 0.5;

    object.addBall(ballx, bally, ballz, strength, subtract);
  }

  if (floor) object.addPlaneY(2, 12);
  if (wallz) object.addPlaneZ(2, 12);
  if (wallx) object.addPlaneX(2, 12);

  object.update();
}

const clock = new THREE.Clock();
let time = 0;

function animate() {
  const delta = clock.getDelta();
  time += delta * 1.0;

  updateCubes(effect, time, 7, true, false, false);

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  stats.update();
}

animate();
