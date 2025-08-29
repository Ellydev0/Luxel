import { useLightStore } from "../stores/LightStore";
import { useRegisterMeshStore } from "../stores/RegisterMeshStore";
import { download } from "./download";

export const useExport = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  });
  const getMesh = useRegisterMeshStore((state) => {
    return state.getMesh;
  });

  const imports = `
   import { Canvas, type CanvasProps } from "@react-three/fiber";
   import type { FC } from "react";
   import * as THREE from "three";\n
    `;
  return (name: string, extension: "tsx" | "jsx") => {
    const lightElements = lights
      .map((light) => {
        switch (light.lightType) {
          case "directional":
            return `<directionalLight
                key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                target={targetObj(${getMesh(light.target.toLowerCase(), true)})}
                castShadow={${light.shadow}}
              ></directionalLight>`;
          case "hemisphere":
            return ` <hemisphereLight
                key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                groundColor={${light.groundColor}}
              />`;

          case "point":
            return ` <pointLight
                 key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                castShadow={${light.shadow}}
                distance={${light.distance}}
                decay={${light.decay}}
              />`;

          case "spot":
            return `<spotLight
                key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                target={targetObj(${getMesh(light.target.toLowerCase(), true)})}
                castShadow={${light.shadow}}
                penumbra={${light.penumbra}}
                angle={${light.angle}}
                distance={${light.distance}}
              ></spotLight>`;
        }
      })
      .join("\n");

    const content = `${imports}
    export const ${
      name.charAt(0).toUpperCase() + name.slice(1)
    }: FC<CanvasProps> = ({ children, ...props }) => {

    const targetObj = (pos: [number, number, number]) => {
    const obj = new THREE.Object3D();
    obj.position.set(...pos);
    return obj;
  };
        return (
        <>
        <Canvas {...props}
      style={{
        position: "relative",
      }}>
            ${lightElements}
            {children}
        </Canvas>
        </>
        )
    }
    `;
    download(
      name.charAt(0).toUpperCase() + name.slice(1) + "." + extension,
      content
    );
  };
};
