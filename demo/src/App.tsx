import "./App.css";
import Renderer from "./Renderer";
// import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLuxel } from "luxel";

function App() {
  const Lux = useLuxel("tests");

  return (
    <div className="render">
      <Lux>
        <OrbitControls enableDamping={false} />
        <Renderer />
      </Lux>
    </div>
  );
}

export default App;
