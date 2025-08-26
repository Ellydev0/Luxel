import { useLightStore } from "../stores/LightStore";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLightHelper } from "./useLightHelper";
import { useAmbientStore } from "../stores/AmbientStore";
import { useRegisterMeshStore } from "../stores/RegisterMeshStore";

export const CoreLights = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  }); //light state

  const deletedLightKey = useLightStore((state) => {
    return state.deletedLightKey;
  });

  const ambientLight = useAmbientStore().AmbientLight;

  const getMesh = useRegisterMeshStore((state) => {
    return state.getMesh;
  });

  const keys = lights.map((light) => light.key);

  const helper = useLightHelper();
  const lightsRef = useRef<THREE.Light[]>([]);

  const trackLightsRef = (el: THREE.Light | null) => {
    //Assigns helpers to each light added to the scene
    if (el) {
      if (!lightsRef.current.some((light) => light.uuid === el.uuid)) {
        const len = lightsRef.current.length;
        el.userData.key = keys[len];
        lightsRef.current.push(el);
        helper(lightsRef, keys);
      }
    }
  };

  //deletes the light ref
  useEffect(() => {
    if (deletedLightKey !== "") {
      lightsRef.current = lightsRef.current.filter((light) => {
        if (light.userData.key !== deletedLightKey) {
          return light;
        }
      });
    }
  });
  return (
    <>
      <ambientLight
        intensity={ambientLight.intensity ? ambientLight.intensity : 0}
        color={ambientLight.color}
      />

      {lights.map((light) => {
        switch (light.lightType) {
          case "directional":
            return (
              <directionalLight
                key={light.key}
                ref={trackLightsRef}
                name={light.name}
                color={light.color}
                intensity={light.intensity}
                position={[
                  light.position.x,
                  light.position.y,
                  light.position.z,
                ]}
                target={getMesh(light.target.toLowerCase())}
                castShadow={light.shadow}
              ></directionalLight>
            );

          case "hemisphere":
            return (
              <hemisphereLight
                key={light.key}
                ref={trackLightsRef}
                position={[
                  light.position.x,
                  light.position.y,
                  light.position.z,
                ]}
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
                position={[
                  light.position.x,
                  light.position.y,
                  light.position.z,
                ]}
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
                position={[
                  light.position.x,
                  light.position.y,
                  light.position.z,
                ]}
                target={getMesh(light.target.toLowerCase())}
                penumbra={light.penumbra}
                angle={light.angle}
                distance={light.distance}
                castShadow={light.shadow}
              ></spotLight>
            );
        }
      })}
    </>
  );
};
