/**
 * A Zustand powered store for storing necessary data for light helpers in the scene
 */

import { create } from "zustand";
import * as THREE from "three";

type HelperStore = {
  helperArr: THREE.Object3D[];
  selectedLight: string;
  scene: THREE.Scene;
  setSelectedLight: (key: string) => void;
  addHelper: (helper: THREE.Object3D) => void;
  deleteHelpers: (helper: THREE.Object3D) => void;
  setScene: (scene: THREE.Scene) => void;
};
export const useHelperStore = create<HelperStore>()((set) => ({
  helperArr: [] as THREE.Object3D[],
  selectedLight: "",
  scene: {} as THREE.Scene,
  setSelectedLight: (key) =>
    set((state) => ({ selectedLight: (state.selectedLight = key) })),
  deleteHelpers: (helper) =>
    set((state) => ({
      helperArr: state.helperArr.filter((help) => help !== helper),
    })),
  addHelper: (helper) =>
    set((state) => ({
      helperArr: [...state.helperArr, helper],
    })),
  setScene: (scene) => set((state) => ({ scene: scene })),
}));
