import { useEffect, useState } from "react";
import { AmbientLight, LightData } from "../types/lights";
import { useLightStore } from "../stores/LightStore";
import { useAmbientStore } from "../stores/AmbientStore";
import { usePresetStore } from "../stores/PresetStore";

export const useLoadPreset = (preset: string) => {
  /**
   * This is a hook that loads preset data into zustand if it exists in the local storage
   * If the preset doesn't exist, it loads an array with an ambient light into the local storage
   */

  const addLights = useLightStore((state) => {
    return state.addLights;
  });
  const resetLights = useLightStore((state) => {
    return state.resetLight;
  });
  const updateAmbientLights = useAmbientStore((state) => {
    return state.updateAmbientLights;
  });
  const setPreset = usePresetStore((state) => {
    return state.setPreset;
  });
  const [data, setData] = useState<LightData[]>([
    {
      color: "#ffffff",
      intensity: 0,
      lightType: "ambient",
      type: "ambient",
    } as AmbientLight,
  ]);

  useEffect(() => {
    //returns JSON if the preset exist and null if otherwise
    const storedPreset = localStorage.getItem(preset);
    setPreset(preset);

    if (storedPreset) {
      try {
        //getting the data from the local storage
        const parsedPreset: LightData[] = JSON.parse(storedPreset);
        setData(parsedPreset);

        //loading it to zustand
        resetLights();
        parsedPreset.map((light) => {
          if (light.lightType !== "ambient") {
            addLights(light);
          } else {
            updateAmbientLights(light);
          }
        });
      } catch (err) {
        console.error(err, "Invalid JSON string passed to be parsed", preset);
      }
    } else {
      //loads an empty array of LightData
      console.log(data);
      const defaultData = JSON.stringify(data);
      localStorage.setItem(preset, defaultData);
    }
  }, [preset]);
};
