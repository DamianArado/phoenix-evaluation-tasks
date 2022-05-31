import './style/main.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Basic DOM manipulation
document.getElementById('canvas').onclick = () => {
  document.getElementById('overlay').innerHTML = 'Canvas Clicked!';
};
document.getElementById('heading').onmouseover = () => {
  document.getElementById('overlay').innerHTML = 'Hello!';
};

// Base Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
// Unlike a .OBJ file materials are directly part of the format of a .GLTF file
const loader = new GLTFLoader();
loader.load('objects/Pix.gltf', function (gltf) {
  const geometry = gltf.scene.children[0].geometry;
  geometry.computeVertexNormals(false);
  let mesh = new THREE.Mesh(geometry, buildTwistMaterial(1500));
  mesh.position.set(0, 0, 0);
  scene.add(mesh);
});

/**
 * MATERIAL
 */

function buildTwistMaterial(amount) {
  const material = new THREE.MeshNormalMaterial();
  material.onBeforeCompile = function (shader) {
    shader.uniforms.time = { value: -2 };

    shader.vertexShader = 'uniform float time;\n' + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [
        `float theta = sin( time + position.y ) / ${amount.toFixed(1)};`,
        'float c = cos( theta );',
        'float s = sin( theta );',
        'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
        'vec3 transformed = vec3( position ) * m;',
        'vNormal = vNormal * m;',
      ].join('\n')
    );

    material.userData.shader = shader;
  };

  // Make sure WebGLRenderer doesnt reuse a single program
  material.customProgramCacheKey = function () {
    return amount;
  };

  return material;
}

// Cover Blob
const randomgeometry = new THREE.PlaneGeometry(50, 50, 50);
const randomaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
// Material Props
randomaterial.wireframe = true;
// Create Mesh and Add it to the Scene
const randomblob = new THREE.Mesh(randomgeometry, randomaterial);
randomblob.rotation.x = 1.5;
randomblob.position.y = -1.5;
scene.add(randomblob);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
});

// Base camera: Perspective Camera
const camera = new THREE.PerspectiveCamera(
  50,
  sizes.width / sizes.height,
  0.1,
  10000
);
camera.position.set(0, 0, 5000);
scene.add(camera);

// Controls: OrbitControls as we are orbiting around the target object
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;
controls.enablePan = false;
controls.dampingFactor = 0.05;
controls.maxDistance = 100000;
controls.minDistance = 2;
controls.touches = {
  ONE: THREE.TOUCH.ROTATE,
  TWO: THREE.TOUCH.DOLLY_PAN,
};
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  scene.traverse(function (child) {
    if (child.isMesh) {
      const shader = child.material.userData.shader;

      if (shader) {
        shader.uniforms.time.value = performance.now() / 1000;
      }
    }
  });
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
