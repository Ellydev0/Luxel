import * as THREE from "three";
import { useRegisterMeshStore } from "./stores/RegisterMeshStore";

/**
 * This is a hook that accepts an Object3D and a reference name, a string, it registers the object3d to a zustand store and allows you to use as a target in the directional light and spot light by just typing the reference name
 */

export const useRegisterMesh = (mesh: THREE.Object3D, ref: string) => {
  const registerMesh = useRegisterMeshStore((state) => {
    return state.registerMesh;
  });
  registerMesh(mesh, ref.toLowerCase());
};
