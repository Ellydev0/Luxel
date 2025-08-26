/**
 * A Zustand powered store, that stores states of the internal default
 * ambient light in luxel
 */
import { create } from "zustand";
import { AmbientLight } from "../types/lights";
import { uid } from "uid";

type AmbientStore = {
  AmbientLight: AmbientLight; //contain any type of

  updateAmbientLights: (newProps: Partial<AmbientLight>) => void;
};

export const useAmbientStore = create<AmbientStore>()((set) => ({
  AmbientLight: {} as AmbientLight,

  updateAmbientLights: (
    newProps //will be used to update ambient lights (to be used in luxel factory)
  ) =>
    set((state) => ({
      AmbientLight: { ...state.AmbientLight, ...newProps },
    })),
}));
