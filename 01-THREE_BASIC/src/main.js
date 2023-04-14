import * as THREE from 'three';
import { gsap } from 'gsap';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// 相机轨道控制器
const oc = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼
oc.enableDamping = true;

document.body.appendChild(renderer.domElement);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

scene.add(mesh);

function addHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  axesHelper.position.set(0, 0.1, 0);
  const gridHelper = new THREE.GridHelper(1000, 1000);

  scene.add(axesHelper, gridHelper);
}

const tl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
tl.to(mesh.position, { x: 5, y: 5, z: 1, duration: 1 }, { x: 10, y: 10, z: 10 })
  .to(mesh.scale, { x: 3, y: 10, z: 5, duration: 1 })
  .to(mesh.rotation, { x: Math.PI / 4, y: 10, z: 10, duration: 1 });

const gui = new dat.GUI();
const cubeFolder = gui.addFolder('立方体');
cubeFolder
  .add(mesh.position, 'x')
  .min(0)
  .max(10)
  .step(0.01)
  .name('移动x轴')
  .onChange((v) => {
    console.log('值被修改', v);
  })
  .onFinishChange((v) => {
    console.log('停留在', v);
  });

cubeFolder.addColor({ color: 0xffff00 }, 'color').onChange((v) => {
  mesh.material.color.set(v);
});

cubeFolder.add(mesh, 'visible');
cubeFolder.add(mesh.material, 'wireframe');
cubeFolder
  .add(
    {
      fn: () => {
        if (tl.isActive()) {
          tl.pause();
        } else {
          tl.play();
        }
      },
    },
    'fn',
  )
  .name('handle');

scene.add(gui);
addHelper();

gsap.ticker.add(() => {
  renderer.render(scene, camera);
  oc.update();
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.innerWidth / window.innerHeight);
});

window.addEventListener('dblclick', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    renderer.domElement.requestFullscreen();
  }
});
