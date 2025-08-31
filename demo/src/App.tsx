import "./App.css";
// import { Luxel } from "./Luxel";
import Renderer from "./Renderer";
import { Environment, OrbitControls } from "@react-three/drei";
import { useLuxel } from "luxel";

function App() {
  const Luxel = useLuxel("scene1", 10);

  return (
    <div className="render">
      <Luxel shadows camera={{ fov: 35, position: [7, 10, 25] }}>
        <Environment
          files={"./moonless_golf_1k.hdr"}
          environmentIntensity={0.2}
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
