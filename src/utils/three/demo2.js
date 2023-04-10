import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from '@/utils/three/shader/LineAnimate/vertex.glsl';
import fragmentShader from '@/utils/three/shader/LineAnimate/fragment.glsl';
import { genPointsBetweenTwoPoints } from '@/utils/three/ThreeUtils';
import InitUtil from '@/utils/three/InitUtil';
import gsap from 'gsap';

let container, scene, camera, renderer, oc;

export function init() {
  const instance = new InitUtil('#container')

  container = instance.container;
  scene = instance.scene;
  camera = instance.camera;
  renderer = instance.renderer;
  oc = instance.orbitControls;
}

function randomVec3Color() {
  return new THREE.Vector3(Math.random() * 0.6 + 0.4, Math.random() * 0.6 + 0.4, Math.random() * 0.6 + 0.4);
}

export function drawFlyLine(start, end) {
  var points = genPointsBetweenTwoPoints(start, end, 4000).map((point) => new THREE.Vector3(point.x, point.y, point.z));
  var geometry = new THREE.BufferGeometry().setFromPoints(points);
  var length = points.length;

  var percents = new Float32Array(length);
  for (let i = 0; i < points.length; i += 1) {
    percents[i] = i / length;
  }

  geometry.setAttribute('percent', new THREE.BufferAttribute(percents, 1));

  let shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_time: { value: 0 },
      number: { type: 'f', value: 10 },
      speed: { type: 'f', value: 0.3 },
      length: { type: 'f', value: 0.5 },
      size: { type: 'f', value: 4.0 },
      color: { type: 'v3', value: randomVec3Color() }
    },
    vertexShader,
    fragmentShader,
    transparent: true
  });
  var flyLine = new THREE.Points(geometry, shaderMaterial);

  gsap.ticker.add(() => {
    shaderMaterial.uniforms.u_time.value += 0.01;
  });

  scene.add(flyLine);
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.domElement.width = window.innerWidth;
  renderer.domElement.height = window.innerHeight;
}

export function animate() {
  drawFlyLine([0, 0, 0], [100, 100, 100]);
  onWindowResize();
}
