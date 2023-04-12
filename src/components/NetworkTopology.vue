<template>
  <div id="container" ref="container"></div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { createNodes, setNodesPosition, setNodesColor } from '@/utils/three/ThreeUtils.js';

  export default {
    setup() {
      const container = ref(null);

      function initTopology(container) {
        // Create three.js scene, camera and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          60,
          container.value.clientWidth / container.value.clientHeight,
          0.1,
          1000
        );
        const renderer = new THREE.WebGL1Renderer();

        renderer.setSize(container.value.clientWidth, container.value.clientHeight);
        container.value.appendChild(renderer.domElement);

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        // Create a few network node positions
        const nodes = [
          { id: 1, x: -10, y: 0, z: 0 },
          { id: 2, x: 10, y: 0, z: 0 },
          { id: 3, x: 0, y: 10, z: 0 },
          { id: 4, x: 0, y: -10, z: 0 },
          { id: 5, x: 0, y: 0, z: 10 },
          { id: 6, x: 0, y: 0, z: -10 }
        ];

        const nodeMap = nodes.reduce((map, e) => {
          map[e.id] = e;
          return map;
        }, {});

        const nodeGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff });

        for (const position of nodes) {
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          node.position.set(position.x, position.y, position.z);
          scene.add(node);
        }

        const linkGeometry = new THREE.BufferGeometry();
        const linkPositions = new Float32Array(
          [1, 2, 1, 4, 2, 5, 2, 6, 3]
            .map((id) => {
              const node = nodeMap[id];
              return [node.x, node.y, node.z];
            })
            .flat(Infinity)
        );

        linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3));

        const linkMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        const links = new THREE.LineSegments(linkGeometry, linkMaterial);
        scene.add(links);

        camera.position.set(0, 0, 20);
        camera.lookAt(scene.position);

        const nodes1 = createNodes(100);
        setNodesPosition(nodes1, 100);
        setNodesColor(nodes1, 100);
        scene.add(nodes1);

        function animation() {
          requestAnimationFrame(animation);

          orbitControls.update();

          renderer.render(scene, camera);
        }
        animation();
      }

      onMounted(() => {
        initTopology(container);
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
