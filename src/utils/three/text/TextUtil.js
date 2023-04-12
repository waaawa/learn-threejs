import { gsap } from 'gsap';
import * as THREE from 'three';

/**
 * 创建一个函数，接收3D对象和描述信息作为参数
 * @param {THREE.Object3D} object3D 
 * @param {string} description 
 */
export function createPopup(object3D, description) {
  // 创建2D描述弹窗
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.textContent = description;
  document.body.appendChild(popup);

  // 获取3D对象的屏幕坐标
  const position = new THREE.Vector3();
  position.setFromMatrixPosition(object3D.matrixWorld);
  const screenPosition = position.clone().project(camera);

  // 将屏幕坐标转换为像素坐标
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  const x = (screenPosition.x * widthHalf) + widthHalf;
  const y = -(screenPosition.y * heightHalf) + heightHalf;

  // 设置弹窗的位置
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  // 弹窗动画
  gsap.fromTo(popup, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 });
}