import type { RouteRecordRaw } from 'vue-router';
import Example from '@/views/examples/index.vue';

const examples: RouteRecordRaw = {
  path: '/example',
  name: 'Example',
  component: Example,
  children: [
    {
      path: 'flying-line',
      name: 'flyingLine',
      component: () => import('@/views/examples/components/FlyingLine.vue')
    },
    {
      path: 'network-topology',
      name: 'networkTopology',
      component: () => import('@/views/examples/components/NetworkTopology.vue')
    },
    {
      path: '/shader',
      name: 'learnShader',
      component: () => import('@/views/examples/components/LearnShader.vue')
    }
  ]
};

export default examples;
