import { useRef } from "react";
import * as THREE from "three";
import { useRegisterMesh } from "luxel-r3f";
// import { useFrame } from "@react-three/fiber";

const Renderer = () => {
  const box = useRef<THREE.Object3D>(null!);
  const plane = useRef<THREE.Object3D>(null!);
  const knot = useRef<THREE.Object3D>(null!);
  const sphere = useRef<THREE.Object3D>(null!);
  const cone = useRef<THREE.Object3D>(null!);
  const torus = useRef<THREE.Object3D>(null!);
  useRegisterMesh(box.current, "Box");
  useRegisterMesh(plane.current, "plane");
  useRegisterMesh(knot.current, "knot");
  useRegisterMesh(sphere.current, "sphere");
  useRegisterMesh(cone.current, "cone");
  useRegisterMesh(torus.current, "torus");

  //Uncomment to animate box
  // useFrame((_, delta) => {
  //   box.current.position.x -= delta;
  // });

  return (
    <>
      <mesh castShadow ref={box} position={[2.5, 2, -10]}>
        <boxGeometry args={[5, 5, 5]} />
        <meshStandardMaterial color={"hotpink"} />
      </mesh>

      <mesh
        castShadow
        position={[20, 1.5, -15]}
        rotation={[Math.PI / 2, 0, 0]}
        ref={knot}
      >
        <torusKnotGeometry args={[2, 0.67, 128, 20]} />
        <meshStandardMaterial color={"blue"} roughness={0.12} />
      </mesh>

      <mesh castShadow position={[-16, 1.5, -20]} ref={sphere}>
        <sphereGeometry args={[5]} />
        <meshStandardMaterial color={"white"} roughness={0.23} />
      </mesh>

      <mesh castShadow position={[-20, 0.5, 20]} ref={cone}>
        <coneGeometry args={[10, 20, 15, 7.5]} />
        <meshStandardMaterial color={"green"} roughness={0.34} />
      </mesh>

      <mesh
        castShadow
        position={[-5, 0.5, 3]}
        ref={torus}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[3, 1.5, 15]} />
        <meshStandardMaterial color={"red"} roughness={0.4} />
      </mesh>

      {/* Floor */}
      <mesh
        scale={100}
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
