import { Canvas, type CanvasProps } from "@react-three/fiber";
import type { FC } from "react";
import * as THREE from "three";

export const Luxel: FC<CanvasProps> = ({ children, ...props }) => {
  const targetObj = (pos: [number, number, number]) => {
    const obj = new THREE.Object3D();
    obj.position.set(...pos);
    return obj;
  };
  return (
    <>
      <Canvas
        {...props}
        style={{
          position: "relative",
        }}
      >
        <directionalLight
          key={"vnq"}
          name={""}
          color={"#e8e8e8"}
          intensity={-0.9000000000000001}
          position={[3, 3, 3]}
          target={targetObj([0, 0, 0])}
          castShadow={true}
        ></directionalLight>
        <spotLight
          key={"o73"}
          name={""}
          color={"#ffffff"}
          intensity={11.700000000000001}
          position={[-0.9999999999999991, 8, 3]}
          target={targetObj([0, -0.5, 0])}
          castShadow={false}
          penumbra={1}
          angle={0.3}
          distance={0}
        ></spotLight>
        {children}
      </Canvas>
    </>
  );
};
