import { useCoreGui } from "./core/useCoreGui";
import { CoreCanvas } from "./core/CoreCanvas";
import { useFactoryGui } from "./factory/useFactoryGui";
import { useLoadPreset } from "./storage/useLoadPreset";
import { useHelperStore } from "./stores/HelperStore";

/**
 * This is the main hook, it accepts a preset as a string and a r3f canvas component
 * @param preset
 * @returs FC<CanvasProps>
 */
export const useLuxel = (preset: string, helperScale = 1) => {
  //new param -> helper scale
  const setHelperScale = useHelperStore((state) => {
    return state.setHelperScale;
  });
  setHelperScale(helperScale);
  //a hook that loads the preset data to zustand
  useLoadPreset(preset);
  useCoreGui(); //renders luxel core gui that creates lights and loads straight to zustand
  useFactoryGui(); //renders controls for various lights in the scene

  return CoreCanvas; //a light canvas
};
