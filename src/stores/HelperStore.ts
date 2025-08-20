/**
 * A Zustand powered store for storing necessary data for light helpers in the scene
 */

import { create } from "zustand";
import * as THREE from "three";

type HelperStore = {
  helperArr: THREE.Object3D[];
  selectedLight: string;
  setSelectedLight: (key: string) => void;
};
export const useHelperStore = create<HelperStore>()((set) => ({
  helperArr: [] as THREE.Object3D[],
  selectedLight: "",
  setSelectedLight: (key) =>
    set((state) => ({ selectedLight: (state.selectedLight = key) })),
}));
