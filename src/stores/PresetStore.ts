import { create } from "zustand";

type PresetStore = {
  preset: string;

  setPreset: (newPreset: string) => void;
};

export const usePresetStore = create<PresetStore>()((set) => ({
  preset: "",
  setPreset: (newPreset) =>
    set(() => ({
      preset: newPreset,
    })),
}));
