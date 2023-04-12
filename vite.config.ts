import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import GLSLPlugin from './plugins/glslPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx({}), GLSLPlugin()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': '/src',
      '#': '/types'
    }
  }
});
