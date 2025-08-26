import { useCallback, useRef } from "react";
import { usePresetStore } from "../stores/PresetStore";
import { AmbientLight, LightData } from "../types/lights";

export const useUpdatePreset = () => {
  /**
   * This hook returns 3 functions,one adds light, the other updates the light, the last updates the ambient light
   */
  const timeoutRef = useRef<number>(null);

  const preset = usePresetStore((state) => {
    return state.preset;
  });
  const delay = 300;

  //add light
  const add = (light: LightData) => {
    const currentData: LightData[] = JSON.parse(
      localStorage.getItem(preset) as string
    );
    currentData.push(light);
    localStorage.setItem(preset, JSON.stringify(currentData));
  };

  //update light
  const update = useCallback(
    (key: string, newProps: Partial<LightData>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        try {
          const currentData: LightData[] = JSON.parse(
            localStorage.getItem(preset) as string
          );
          const newData = currentData.map((light) =>
            light.key === key ? { ...light, ...newProps } : light
          );
          localStorage.setItem(preset, JSON.stringify(newData));
        } catch (err) {
          console.error(err, "Failed");
        }
      }, delay);
    },
    [preset, delay]
  );

  //update Ambient Light
  const updateAmbient = useCallback(
    (newProps: Partial<AmbientLight>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        try {
          const currentData: LightData[] = JSON.parse(
            localStorage.getItem(preset) as string
          );
          const newData = currentData.map((light) =>
            light.type === "ambient" ? { ...light, ...newProps } : light
          );
          localStorage.setItem(preset, JSON.stringify(newData));
        } catch (err) {
          console.error(err, "Failed");
        }
      }, delay);
    },
    [preset, delay]
  );
  return { add, update, updateAmbient };
};
