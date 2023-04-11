<template>
  <div id="container" ref="container"></div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
  import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
  import { FlyControls } from 'three/examples/jsm/controls/FlyControls';

  import {
    genNodes,
    genPoints,
    genNodeRelation,
    randomConnectRelation,
    connectNodes,
    loadModel,
    genGrid,
    drawAttackLineAnimation
  } from '@/utils/three/ThreeUtils.js';
  import InitUtil from '@/utils/three/InitUtil.js';
  import { drawFlyingLine } from '@/utils/three/line.js';

  export default {
    setup() {
      const container = ref(null);

      onMounted(() => {
        const { scene } = new InitUtil(container.value);

        const nodes1 = genNodes({ count: 2, y: 0, distance: 50 });
        const nodes2 = genNodes({ count: 8, y: 20, distance: 400 });
        // const nodes3 = genNodes({ count: 5000, y: 1200, distance: 3000 });
        // const nodes4 = genNodes({ count: 10000, y: 500, distance: 5000 });
        // const nodes5 = genNodes({ count: 80000, y: 0, distance: 8000 });

        const nodeMap = nodes1
          .concat(nodes2)
          // .concat(nodes3)
          // .concat(nodes4)
          // .concat(nodes5)
          .reduce((map, node) => {
            map[node.id] = node;
            return map;
          }, {});

        const layer1 = genPoints(nodes1);
        const layer2 = genPoints(nodes2);
        // const layer3 = genPoints(nodes3);
        // const layer4 = genPoints(nodes4);
        // const layer5 = genPoints(nodes5);

        // const relation = genNodeRelation(nodes1.concat(nodes2).concat(nodes3).concat(nodes4).concat(nodes5));
        const relation = genNodeRelation(nodes1.concat(nodes2));

        // randomConnectRelation(relation, [nodes5, nodes4, nodes3, nodes2, nodes1]);
        randomConnectRelation(relation, [nodes2, nodes1]);
        const lines = connectNodes(relation, nodeMap);

        scene.add(layer1);
        scene.add(layer2);
        // scene.add(layer3);
        // scene.add(layer4);
        // scene.add(layer5);

        const vertexShader = `
          uniform vec3 u_position;

          void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(u_position + position, 1);

            gl_PointSize = 2.0;
          }
        `;

        const fragmentShader = `
          uniform vec3 u_color;

          void main() {
            gl_FragColor = vec4(u_color, 1.0);
          }
        `;

        const startPoint = new THREE.Vector3(0, 0, 0);
        const endPoint = new THREE.Vector3(10, 10, 10);
        const u_color = new THREE.Color(0, 1, 1);

        const uniforms = {
          u_color: { value: u_color },
          u_position: { value: startPoint },
          u_start: { value: startPoint },
          u_end: { value: endPoint }
        };
        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader,
          fragmentShader
        });
        const geometry = new THREE.BufferGeometry().setFromPoints([startPoint, endPoint]);

        // const percents = new Float32Array(2);
        // percents[0] = 0;
        // percents[1] = 100;

        // geometry.setAttribute('precent', new THREE.BufferAttribute(percents, 1));

        const line = new THREE.Points(geometry, material);
        scene.add(line);
      });

      return {
        container
      };
    }
  };
</script>

<style>
  #container {
    height: 100vh;
    width: 100%;
  }
</style>
