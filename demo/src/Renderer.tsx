import { useRef } from "react";
import * as THREE from "three";
import { useRegisterMesh } from "luxel";

const Renderer = () => {
  const box = useRef<THREE.Object3D>(null!);
  const plane = useRef<THREE.Object3D>(null!);
  useRegisterMesh(box.current, "Box");
  useRegisterMesh(plane.current, "plane");

  return (
    <>
      <mesh castShadow receiveShadow ref={box} position={[2, 2, -2]}>
        <boxGeometry />
        <meshStandardMaterial color={"white"} />
      </mesh>
      <mesh
        scale={3}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        ref={plane}
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color={"white"} />
      </mesh>
    </>
  );
};

export default Renderer;
