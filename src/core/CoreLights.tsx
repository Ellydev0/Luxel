import { useLightStore } from "../stores/LightStore";
import { useRef } from "react";
import * as THREE from "three";
import { useLightHelper } from "./useLightHelper";
import { AmbientLight } from "../types/lights";

export const CoreLights = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  }); //light state

  const keys = lights.map((light) => light.key);

  const helper = useLightHelper();
  const lightsRef = useRef<THREE.Light[]>([]);

  const trackLightsRef = (el: THREE.Light | null) => {
    //Assigns helpers to each light added to the scene
    if (el) {
      if (!lightsRef.current.some((light) => light.uuid === el.uuid)) {
        lightsRef.current.push(el);
        helper(lightsRef, keys);
      }
    } else {
      lightsRef.current = lightsRef.current.filter((light) => light !== el);
    }
  };

  return lights.map((light) => {
    switch (light.lightType) {
      case "ambient":
        return (
          <ambientLight
            key={light.key}
            name={light.name}
            color={light.color}
            intensity={light.intensity}
          />
        );

      case "directional":
        return (
          <directionalLight
            key={light.key}
            ref={trackLightsRef}
            name={light.name}
            color={light.color}
            intensity={light.intensity}
            position={[light.position.x, light.position.y, light.position.z]}
            castShadow={light.shadow}
          ></directionalLight>
        );

      case "hemisphere":
        return (
          <hemisphereLight
            key={light.key}
            ref={trackLightsRef}
            name={light.name}
            color={light.color}
            groundColor={light.groundColor}
            intensity={light.intensity}
          />
        );

      case "point":
        return (
          <pointLight
            key={light.key}
            name={light.name}
            ref={trackLightsRef}
            color={light.color}
            position={[light.position.x, light.position.y, light.position.z]}
            intensity={light.intensity}
            distance={light.distance}
            decay={light.decay}
            castShadow={light.shadow}
          />
        );

      case "spot":
        return (
          <spotLight
            key={light.key}
            ref={trackLightsRef}
            name={light.name}
            color={light.color}
            intensity={light.intensity}
            position={[light.position.x, light.position.y, light.position.z]}
            penumbra={light.penumbra}
            angle={light.angle}
            distance={light.distance}
            castShadow={light.shadow}
          ></spotLight>
        );

      default:
        return (
          <ambientLight
            key={(light as AmbientLight).key}
            name={(light as AmbientLight).name}
            color={(light as AmbientLight).color}
            intensity={(light as AmbientLight).intensity}
          />
        );
    }
  });
};
