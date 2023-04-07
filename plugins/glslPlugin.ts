import type { Plugin } from 'vite';

const fileRegex = /\.(vs|fs|glsl)$/;

export default function myPlugin(): Plugin {
  return {
    name: 'transform-glsl-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        return {
          code: `export default \`${src}\`;`,
          map: null // 如果可行将提供 source map
        };
      }
    }
  };
}
