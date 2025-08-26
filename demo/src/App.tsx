import "./App.css";
import Renderer from "./Renderer";
// import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLuxel } from "luxel";

function App() {
  const Luxel = useLuxel("scene1");

  return (
    <div className="render">
      <Luxel shadows>
        <OrbitControls enableDamping={false} />
        <Renderer />
      </Luxel>
    </div>
  );
}

export default App;
