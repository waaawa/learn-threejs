import * as THREE from 'three';
import { gsap } from 'gsap';

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;

/**
 * 根据给定的参数绘制一条飞行线，并将其添加到场景中
 * @param {Object} params - 包含线条参数的对象
 * @param {THREE.Scene} scene - 要添加线条的场景
 */
export function drawFlyingLine(params, scene) {
  const { startPoint, endPoint, color } = params;
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
  });
  const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  // gsap.to(line.position, { duration: 1, x: "+=50", yoyo: true, repeat: -1 });
}
