import { useCoreGui } from "./core/useCoreGui";
import { CoreCanvas } from "./core/CoreCanvas";
import { useFactoryGui } from "./factory/useFactoryGui";
export const useLuxel = (preset: string) => {
  //new param -> helper scale
  //if preset doesn't exist in local storage call luxel core gui, if it does load it into zustand
  useCoreGui(); //renders luxel core gui that creates lights and loads straight to zustand
  useFactoryGui(); //renders controls for various lights in the scene

  return CoreCanvas; //a light canvas
};
