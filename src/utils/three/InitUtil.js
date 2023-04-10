import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { isString } from '@/utils/is';

export default class InitUtil {
  constructor(container) {
    this.container = isString(container) ? document.querySelector(container) : container;
    this.init();
  }

  init() {
    // 第一步新建一个场景
    this.scene = new THREE.Scene();
    this.setCamera();
    this.setRenderer();
    this.setHelper();
    this.setOrbitControls();

    this.animate();
  }

  // 新建透视相机
  setCamera() {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;
  }

  // 设置渲染器
  setRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    // 设置画布的大小
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearAlpha(0);
    this.renderer.setClearColor(new THREE.Color(0, 0, 0, 0));

    //这里 其实就是canvas 画布  renderer.domElement
    this.container.appendChild(this.renderer.domElement);
  }

  // 设置环境光
  setLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff); // 环境光
    this.scene.add(ambientLight);
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  setHelper() {
    this.gridHelper = new THREE.GridHelper(100, 30, 0x2c2c2c, 0x888888);
    this.gridHelper.position.y = -10;

    this.axesHelper = new THREE.AxesHelper(100);

    this.scene.add(this.gridHelper);
    this.scene.add(this.axesHelper);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.orbitControls.update();
  }

  animate() {
    gsap.ticker.fps(30);
    gsap.ticker.add(this.render.bind(this));
  }
}
