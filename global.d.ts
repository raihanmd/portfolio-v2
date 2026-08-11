export {};

import type { ThreeElements } from "@react-three/fiber";

declare module "*.glb";
declare module "*.png";

declare module "meshline" {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElements["mesh"];
    meshLineMaterial: ThreeElements["mesh"];
  }
}
