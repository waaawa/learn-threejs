import { ComponentPublicInstance, FunctionalComponent } from 'vue';

declare global {}

declare module 'vue' {
  export type JSXComponent<Props = any> = { new (): ComponentPublicInstance<Props> } | FunctionalComponent<Props>;
}
