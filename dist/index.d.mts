import * as react from 'react';
import * as _react_three_fiber from '@react-three/fiber';
import * as THREE from 'three';

/**
 * This is the main hook, it accepts a preset as a string and a r3f canvas component
 * @param preset
 * @returs FC<CanvasProps>
 */
declare const useLuxel: (preset: string, helperScale?: number) => react.FC<_react_three_fiber.CanvasProps>;

/**
 * This is a hook that accepts an Object3D and a reference name, a string, it registers the object3d to a zustand store and allows you to use as a target in the directional light and spot light by just typing the reference name
 */
declare const useRegisterMesh: (mesh: THREE.Object3D, ref: string) => void;

export { useLuxel, useRegisterMesh };
