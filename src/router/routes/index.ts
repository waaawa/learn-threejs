import type { RouteRecordRaw } from 'vue-router';

const modules = import.meta.glob('./modules/**/*.ts');
const routeModuleList: RouteRecordRaw[] = [];

// 加入到路由集合中

for (const key in modules) {
  const mod = await modules[key]();
  routeModuleList.push((mod as any).default);
}

export const routes: RouteRecordRaw[] = routeModuleList;
