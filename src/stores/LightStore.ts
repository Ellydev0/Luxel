/**
 * A Zustand powered store, that stores states of the main light type
 * See the main light type in types folder for better understanding
 */
import { create } from "zustand";
import { Lights } from "../types/main"; // Enum or union of light type names
import { LightData, LightPropsMap } from "../types/lights";

type LightStore = {
  lights: LightData[]; //contain any type of

  updateLights: <T extends Lights>(
    id: string,
    newProps: Partial<LightPropsMap[T]>
  ) => void;
  addLights: <T extends Lights>(props: LightPropsMap[T]) => void;
  deleteLight: (id: string) => void;
};

export const useLightStore = create<LightStore>()((set) => ({
  lights: [],

  updateLights: (
    id,
    newProps //will be used to update lights (to be used in luxel factory)
  ) =>
    set((state) => ({
      lights: state.lights.map((light) =>
        light.key === id ? { ...light, ...newProps } : light
      ),
    })),
  addLights: (props) =>
    set((state) => ({
      lights: [...state.lights, props],
    })),

  deleteLight: (id) =>
    set((state) => ({
      lights: state.lights.filter((light) => light.key !== id),
    })),
}));
