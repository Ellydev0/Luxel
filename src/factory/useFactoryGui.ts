/**
 * A GUI for each and any SelectedLight that is being selected
 */

import { Pane } from "tweakpane";
import { useHelperStore } from "../stores/HelperStore";
import { useLightStore } from "../stores/LightStore";
import { LightData } from "../types/lights";
import { useEffect } from "react";

export const useFactoryGui = () => {
  /**
   * Getting the SelectedLight object that matches the clicked id
   */
  const lightKey = useHelperStore((state) => {
    return state.selectedLight;
  });
  const lightData: LightData[] | undefined = useLightStore((state) => {
    return state.lights;
  });
  const updateLights = useLightStore((state) => {
    return state.updateLights;
  });

  const SelectedLight = lightData.filter((SelectedLight) => {
    if (SelectedLight.key === lightKey) {
      return SelectedLight;
    }
  })[0]; // SelectedLight that is being selected

  const factory = new Pane({ title: `Name:${SelectedLight?.name}` });

  useEffect(() => {
    if (!SelectedLight) {
      return;
    }

    Object.keys(SelectedLight).forEach((key: any) => {
      if (
        key !== "name" &&
        key !== "key" &&
        key !== "lightType" &&
        key !== "type"
      ) {
        factory.addBinding(SelectedLight, key).on("change", (ev) => {
          updateLights(SelectedLight.key, { [key]: ev.value });
          console.log(ev.value);
        });
      }
    });

    return () => {
      factory.dispose();
    };
  }, [lightKey]);
};
