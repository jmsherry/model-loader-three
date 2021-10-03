import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

scene.add(new THREE.AxesHelper(5));

// Light
{
  {
    const skyColor = 0xb1e1ff; // light blue
    const groundColor = 0xb97a20; // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);

    const helper = new THREE.HemisphereLightHelper(light, 5);
    scene.add(helper);
  }
  {
    const light = new THREE.AmbientLight(0xffffff); // soft white light
    light.position.x = 0;
    light.position.y = -100;
    light.position.z = 0;
    scene.add(light);
  }

  {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 100, 100);

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add(spotLight);
  }
}

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 20;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Cube
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial({ wireframe: true })
// );
// scene.add(cube);

const loader = new GLTFLoader();

const multiplier = 0.001;

let model;

loader.load(
  "/ash_ninja_geo.glb",
  function (gltf) {
    console.log("loading", gltf);

    model = gltf.scene.clone();
    model.scale.set(50, 50, 50);
    scene.add(model);

    model.traverse((object) => {
      if (object.isMesh) {
        console.log("setting", object);
        object.material.color.set(0xff0000);

        // var textTexture = CreateCanvasTexture("This is a test");

        // textTexture.wrapS = THREE.RepeatWrapping;
        // textTexture.wrapT = THREE.RepeatWrapping;

        // textTexture.flipY = false;

        // object.material.map = textTexture;
        // object.material.wireframe = true;
        // object.scale.x = 1 * multiplier;
        // object.scale.y = 1 * multiplier;
        // object.scale.z = 1 * multiplier;
        // object.rotateOnAxis('y', Math.PI);
      }
    });

    // gltf.scene.scale.x = 1 * multiplier;
    // gltf.scene.scale.y = 1 * multiplier;
    // gltf.scene.scale.z = 1 * multiplier;

    // gltf.scene.rotateOnAxis('y', Math.PI);

    scene.add(gltf.scene);
    console.log("scene", scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // const deltaTime = elapsedTime - lastElapsedTime
  lastElapsedTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
