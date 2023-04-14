import * as THREE from 'three';
import InitUtil from '../utils/InitUtil.js';
const { scene } = new InitUtil(document.body);

const geometry = new THREE.BufferGeometry();

const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

const vertices = new Float32Array([
  -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0,
]);

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

const cute = new THREE.Mesh(geometry, material);
scene.add(cute);
