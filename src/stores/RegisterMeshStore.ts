import { create } from "zustand";
import * as THREE from "three";

type RegisterMeshStore = {
  mesh: Record<string, THREE.Object3D>;
  registerMesh: (obj: THREE.Object3D, ref: string) => void;
  getMesh: (ref: string) => THREE.Object3D;
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
  getMesh: (ref) => {
    const res = get().mesh[ref];
    if (res) {
      return res;
    } else {
      return new THREE.Object3D();
    }
  },
}));
