import { create } from "zustand";
import * as THREE from "three";

type RegisterMeshStore = {
  mesh: Record<string, THREE.Object3D>;
  registerMesh: (obj: THREE.Object3D, ref: string) => void;
  getMesh: (ref: string, exporting?: boolean) => THREE.Object3D | string;
};
export const useRegisterMeshStore = create<RegisterMeshStore>()((set, get) => ({
  mesh: {},
  registerMesh: (obj, ref) => {
    set((state) => ({
      mesh: {
        ...state.mesh,
        [ref]: obj,
      },
    }));
  },
  getMesh: (ref, exporting = false) => {
    const res = get().mesh[ref];
    if (!exporting) {
      if (res) {
        return res;
      } else {
        return new THREE.Object3D();
      }
    } else {
      if (res) {
        return `[${res.position.x},${res.position.y},${res.position.z}]
        `;
      } else {
        return `[0,0,0]`;
      }
    }
  },
}));
