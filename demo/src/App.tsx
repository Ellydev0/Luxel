import "./App.css";
import Renderer from "./Renderer";
import { Environment, OrbitControls } from "@react-three/drei";
import { useLuxel } from "luxel-r3f";

function App() {
  const Luxel = useLuxel("scene1", 10);

  return (
    <div className="render">
      <Luxel shadows camera={{ fov: 35, position: [7, 10, 25] }}>
        <Environment
          preset={"night"}
          environmentIntensity={0.8}
          backgroundBlurriness={0.1}
          background
        />
        <OrbitControls enableDamping={false} maxPolarAngle={Math.PI / 2} />
        <Renderer />
      </Luxel>
    </div>
  );
}

export default App;
