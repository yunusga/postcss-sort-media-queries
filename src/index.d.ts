import { Plugin } from "postcss";

type SortOption =
  | "mobile-first"
  | "desktop-first"
  | ((a: string, b: string) => number);

interface Options {
  sort?: SortOption;
  configuration?: {
    unitlessMqAlwaysFirst?: boolean;
  };
}

declare const plugin: (options?: Options) => Plugin;

export default plugin;
