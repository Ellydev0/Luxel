import { usePresetStore } from "../stores/PresetStore";
import { LightData } from "../types/lights";

export const useDeletePreset = () => {
  /**
   * Returns a function that deletes the light from the local storage using the light key for identification
   */
  const preset = usePresetStore((state) => {
    return state.preset;
  });
  return (key: string) => {
    const currentData: LightData[] = JSON.parse(
      localStorage.getItem(preset) as string
    );
    const newData = currentData.filter((light) => light.key !== key);
    localStorage.setItem(preset, JSON.stringify(newData));
  };
};
