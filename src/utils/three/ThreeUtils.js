import { gsap } from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const usedIds = new Set();

export function getId() {
  let makeId = () => Math.floor(Math.random() * 0xffffffff).toString(16);
  let id = makeId();
  while (usedIds.has(id)) {
    id = makeId();
  }
  usedIds.add(id);
  return id;
}

/**
 * 生成节点数组
 * @param {Object} options - 选项对象
 * @param {number} options.count - 节点数量
 * @param {number} options.y - 节点的y坐标
 * @param {number} options.distance - 节点间距
 * @returns {Array} - 节点数组
 */
export function genNodes({ count, y, distance }) {
  const size = Math.ceil(Math.sqrt(count));
  const nodes = [];

  for (let i = 0; i < count; i++) {
    const id = getId();
    const x = (i % size) / size;
    const z = Math.floor(i / size) / size;
    nodes.push({
      id,
      position: { x: x * distance - distance / 2, y, z: z * distance - distance / 2 },
      color: { r: 0, g: 1, b: 1 }
    });
  }

  return nodes;
}

/**
 * 生成Points几合体
 * @param {Array} nodes - 节点数组
 * @returns {THREE.Points} - 生成的Points几合体
 */
export function genPoints(nodes) {
  // 创建BufferGeometry
  const geometry = new THREE.BufferGeometry();
  // 创建PointsMaterial
  const material = new THREE.PointsMaterial({ size: 15, vertexColors: true });

  // 获取节点数量
  const count = nodes.length;
  // 创建存储位置的Float32Array
  const positions = new Float32Array(count * 3);
  // 创建存储颜色的Float32Array
  const colors = new Float32Array(count * 3);

  // 遍历节点数组，将每个节点的位置存储到positions中
  nodes.forEach((e, i) => {
    positions[i * 3] = e.position.x;
    positions[i * 3 + 1] = e.position.y;
    positions[i * 3 + 2] = e.position.z;

    colors[i * 3] = e.color.r;
    colors[i * 3 + 1] = e.color.g;
    colors[i * 3 + 2] = e.color.b;
  });

  // 创建Points几合体
  const points = new THREE.Points(geometry, material);
  // 设置Points几合体的位置
  points.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  points.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // 返回生成的Points几合体
  return points;
}

/**
 * 生成拓扑图连接关系数据结构
 * @param {Array} nodes - 节点数组
 * @returns {Object} - 连接关系数据结构
 */
export function genNodeRelation(nodes) {
  const relation = {};

  nodes.forEach((node) => {
    relation[node.id] = [];
  });

  return relation;
}

export function randomConnectRelation(relation, nodeLayers) {
  // const keys = Object.keys(relation);

  const getIndex = (len) => Math.floor(Math.random() * len);

  nodeLayers.slice(0, -1).forEach((nodes, i) => {
    nodes.slice(nodes.length / 3).forEach((e) => {
      const n = nodeLayers[i + 1];
      const id = n[getIndex(n.length)].id;
      relation[id].push(e.id);
    });
  });
}

/**
 * 连接节点
 * @param {Object} relation - 节点关系数据结构
 * @param {Object} nodeMap - 节点映射表
 */
export function connectNodes(relation, nodeMap) {
  const nodeKeys = Object.keys(relation);

  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({ vertexColors: true });
  const positions = new Float32Array(nodeKeys.length * 3 * 2);
  const colors = new Float32Array(nodeKeys.length * 3 * 2);

  let index = 0;
  nodeKeys.forEach((key) => {
    const node = nodeMap[key];
    const start = new THREE.Vector3(node.position.x, node.position.y, node.position.z);
    relation[key].forEach((targetKey) => {
      const target = nodeMap[targetKey];
      const end = new THREE.Vector3(target.position.x, target.position.y, target.position.z);
      start.toArray(positions, index);
      end.toArray(positions, index + 3);
      colors[index] = 0;
      colors[index + 1] = 0;
      colors[index + 2] = 1;
      colors[index + 3] = 0;
      colors[index + 4] = 0;
      colors[index + 5] = 1;
      index += 6;
    });
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();

  const lines = new THREE.LineSegments(geometry, material);

  return lines;
}

/**
 * 引入模型
 * @param {string} path - 模型路径
 * @returns {Promise<THREE.Group>} - 模型组
 */
export function loadModel(path) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();

    loader.load(
      path,
      (object) => {
        resolve(object);
      },
      null,
      (error) => {
        reject(error);
      }
    );
  });
}

/**
 * 生成无限网格平面
 * @param {number} size - 网格平面的大小
 * @param {number} divisions - 网格平面的分割数
 * @param {THREE.Color} color - 网格平面的颜色
 * @returns {THREE.GridHelper} - 生成的网格平面
 */
export function genGrid(size, divisions, color1 = 0x2c2c2c, color2 = 0x888888) {
  const grid = new THREE.GridHelper(size, divisions, color1, color2);
  // grid.position.set(-size / 2, 0, -size / 2);
  grid.position.set(0, -100, 0);
  return grid;
}

/**
 * 网络拓扑节点 攻击线动画
 * @param {{x:number,y:number,z:number}} node1
 * @param {{x:number,y:number,z:number}} node2
 */
export function drawAttackLineAnimation(node1, node2) {
  const positions = [
    node1.position.x,
    node1.position.y,
    node1.position.z,
    node2.position.x,
    node2.position.y,
    node2.position.z
  ];
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const line = new THREE.Line(lineGeometry, lineMaterial);

  const tl = gsap.timeline({ repeat: -1, paused: true });

  tl.to(line.material.color, { r: 1, duration: 0.5 })
    .to(line.material.color, { g: 1, duration: 0.5 })
    .to(line.material.color, { b: 1, duration: 0.5 })
    .to(line.material.color, { r: 0, duration: 0.5 })
    .to(line.material.color, { g: 0, duration: 0.5 })
    .to(line.material.color, { b: 0, duration: 0.5 });

  return [line, tl];
}

/**
 * 生成两点之间指定数量点
 * @typedef {number} x - x坐标
 * @typedef {number} y - y坐标
 * @typedef {number} z - z坐标
 * @param {[x,y,z]} start - 终点
 * @param {[x,y,z]} end - 终点
 * @param {number} count - 指定数量点
 * @returns {{x,y,z}} - 生成的点数组
 */
export function genPointsBetweenTwoPoints(start, end, count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = start[0] + (end[0] - start[0]) * t;
    const y = start[1] + (end[1] - start[1]) * t;
    const z = start[2] + (end[2] - start[2]) * t;
    points.push({ x, y, z });
  }
  return points;
}

/**
 * 可以将经纬度转化为θ,φ
 * @param {*} longitude
 * @param {*} latitude
 * @param {*} radius
 * @returns {THREE.Vector3}
 */
export function getPosition(longitude, latitude, radius) {
  // 经度，纬度转换为坐标
  let lg = THREE.Math.degToRad(longitude);
  let lt = THREE.Math.degToRad(latitude);
  // 获取x，y，z坐标
  let temp = radius * Math.cos(lt);
  let x = temp * Math.sin(lg);
  let y = radius * Math.sin(lt);
  let z = temp * Math.cos(lg);
  return new THREE.Vector3(x, y, z);
}

/**
 * 获取两点间指定比例位置坐标
 * @param {THREE.Vector3} v1
 * @param {THREE.Vector3} v2
 * @returns
 */
export function getVCenter(v1, v2) {
  let v = v1.add(v2);
  return v.divideScalar(2);
}

/**
 * 获取两点间指定比例位置坐标
 * @param {THREE.Vector3} v1
 * @param {THREE.Vector3} v2
 * @param {number} len
 * @returns
 */
export function getLenVcetor(v1, v2, len) {
  let v1v2Len = v1.distanceTo(v2);
  return v1.lerp(v2, len / v1v2Len);
}

/**
 * 获取贝塞尔控制点，（控制点位置大小需与夹角线性相关）
 * @param {*} v0
 * @param {*} v3
 * @returns
 */
export function getBezierPoint(v0, v3) {
  let angle = (v0.angleTo(v3) * 180) / Math.PI; // 0 ~ Math.PI       // 计算向量夹角
  let aLen = angle * 2.5,
    hLen = angle * angle * 50;
  let p0 = new THREE.Vector3(0, 0, 0); // 法线向量
  let rayLine = new THREE.Ray(p0, getVCenter(v0.clone(), v3.clone())); // 顶点坐标
  let vtop = rayLine.at(hLen / rayLine.at(1).distanceTo(p0), vtop); // 位置
  // 控制点坐标
  let v1 = getLenVcetor(v0.clone(), vtop, aLen);
  let v2 = getLenVcetor(v3.clone(), vtop, aLen);
  return {
    v1: v1,
    v2: v2
  };
}

/**
 * 绘制三次贝塞尔曲线
 * @param {number} longitude 
 * @param {number} latitude 
 * @param {number} longitude2 
 * @param {number} latitude2 
 */
export function drawLine(longitude, latitude, longitude2, latitude2) {
  let geometry = new THREE.Geometry(); //声明一个几何体对象Geometry
  let v0 = getPosition(longitude, latitude, radius);
  let v3 = getPosition(longitude2, latitude2,radius);
  let { v1, v2 } = getBezierPoint(v0, v3); // 三维二次贝赛尔曲线
  let curve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
  let curvePoints = curve.getPoints(100);
  geometry.setFromPoints(curvePoints);
  let material = new THREE.LineBasicMaterial({ color: 0xff7e41 });
  let line = new THREE.Line(geometry, material);
  group.add(line);
  this.sport(curvePoints);
}
