const Renderer = () => {
  return (
    <>
      <mesh castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color={"white"} />
      </mesh>
      <mesh
        scale={3}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry />
        <meshStandardMaterial color={"white"} />
      </mesh>
    </>
  );
};

export default Renderer;
