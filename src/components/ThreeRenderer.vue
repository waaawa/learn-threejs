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
  import { drawFlyingLine } from '@/utils/three/line.js';

  export default {
    setup() {
      const container = ref(null);

      onMounted(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          120,
          container.value.clientWidth / container.value.clientHeight,
          0.1,
          10000
        );
        const renderer = new THREE.WebGL1Renderer();

        renderer.setSize(container.value.clientWidth, container.value.clientHeight);
        container.value.appendChild(renderer.domElement);

        const orbitControls = new OrbitControls(camera, renderer.domElement);
        const trackballControls = new TrackballControls(camera, renderer.domElement);
        const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
        const flyControls = new FlyControls(camera, renderer.domElement);

        camera.position.set(0, 50, 100);
        camera.lookAt(scene.position);

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

        scene.add(lines);

        const grid = genGrid(100, 10, new THREE.Color(0x888888));
        console.log(grid);
        scene.add(grid);

        const [line, tl] = drawAttackLineAnimation(nodes1[0], nodes2[1]);
        scene.add(line);

        const startPoint = new THREE.Vector3(0, 0, 0);
        const endPoint = new THREE.Vector3(10, 10, 10);
        const color = new THREE.Color(0xffff00);

        const params = { uniForms: { position: [0, 0, 0, 10, 10, 10] }, color };
        drawFlyingLine(params, scene);

        // const modelPath = '/models/medieval/Medieval_building.DAE';

        // loadModel(modelPath)
        //   .then((model) => {
        //     // 对加载的模型进行操作
        //     console.log(model);
        //     // scene.add(model);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });

        function animation() {
          requestAnimationFrame(animation);

          orbitControls.update();
          // trackballControls.update();
          // firstPersonControls.update(0);
          // flyControls.update(0);

          renderer.render(scene, camera);
        }
        animation();
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
