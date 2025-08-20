import { Canvas, CanvasProps } from "@react-three/fiber";
import { FC } from "react";
import { CoreLights } from "./CoreLights";
export const CoreCanvas: FC<CanvasProps> = ({ children, ...props }) => {
  return (
    <Canvas
      {...props}
      style={{
        position: "relative",
      }}
    >
      {children}
      <CoreLights />
    </Canvas>
  );
};
