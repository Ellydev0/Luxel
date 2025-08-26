/**
 * A GUI for each and any SelectedLight that is being selected
 */

import { Pane } from "tweakpane";
import { useHelperStore } from "../stores/HelperStore";
import { useLightStore } from "../stores/LightStore";
import { AmbientLight, LightData } from "../types/lights";
import { useEffect } from "react";
import { useAmbientStore } from "../stores/AmbientStore";
import { useUpdatePreset } from "../storage/useUpdatePreset";
import { useDeletePreset } from "../storage/useDeletePreset";

export const useFactoryGui = () => {
  /**
   * This hook creates a different tweakpane gui for the configuration of lights already in the scene
   */
  const updateAmbientLights = useAmbientStore((state) => {
    return state.updateAmbientLights;
  });

  const ambient = useAmbientStore((state) => {
    return state.AmbientLight;
  });

  const AmbientLight: Partial<AmbientLight> = {
    color: ambient.color ? ambient.color : "#ffffff",
    intensity: ambient.intensity ? ambient.intensity : 0,
  };

  const lightKey = useHelperStore((state) => {
    return state.selectedLight;
  });
  const lightData: LightData[] | undefined = useLightStore((state) => {
    return state.lights;
  });
  const updateLights = useLightStore((state) => {
    return state.updateLights;
  });

  const deleteLights = useLightStore((state) => {
    return state.deleteLight;
  });

  const SelectedLight = lightData.filter((SelectedLight) => {
    if (SelectedLight.key === lightKey) {
      return SelectedLight;
    }
  })[0]; // SelectedLight that is being selected

  const helperArr = useHelperStore((state) => {
    return state.helperArr;
  });
  const deleteHelpers = useHelperStore((state) => {
    return state.deleteHelpers;
  });
  const scene = useHelperStore((state) => {
    return state.scene;
  });

  const setDeleteKey = useLightStore((state) => {
    return state.setDeleteKey;
  });

  const { update, updateAmbient } = useUpdatePreset();

  const deleteStorage = useDeletePreset();

  const factory = new Pane();
  const folder = factory.addTab({
    pages: [
      { title: `Name:${SelectedLight?.name}` },
      { title: "AmbientLight Settings" },
    ],
  });

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
        folder.pages[0]?.addBinding(SelectedLight, key).on("change", (ev) => {
          updateLights(SelectedLight.key, { [key]: ev.value }); //updates zustand states
          update(SelectedLight.key, { [key]: ev.value }); //updates local storage
        });
      }
    });
    folder.pages[0]
      ?.addButton({
        title: "Delete Lights",
      })
      .on("click", () => {
        deleteLights(lightKey);
        setDeleteKey(lightKey);
        deleteStorage(lightKey);

        //deleting helpers
        const helper = helperArr.filter((helper) => {
          if (helper.userData.key === lightKey) {
            return helper;
          }
        });

        if (helper[0]) {
          (helper as any)[0].dispose();
          scene.remove(helper[0]);
          deleteHelpers(helper[0]);
        }
      });
    return () => {
      factory.dispose();
    };
  }, [lightKey, helperArr]);

  folder.pages[1]?.addBinding(AmbientLight, "color").on("change", (ev) => {
    if (ev.value) updateAmbientLights({ color: ev.value });
    updateAmbient({ color: ev.value as string });
  });
  folder.pages[1]
    ?.addBinding(AmbientLight, "intensity", {
      step: 0.01,
    })
    .on("change", (ev) => {
      if (ev.value) updateAmbientLights({ intensity: ev.value });
      updateAmbient({ intensity: ev.value as number });
    });
  folder.pages[1]
    ?.addButton({
      title: "Reset AmbientLight",
    })
    .on("click", () => {
      AmbientLight.intensity = 0;
      AmbientLight.color = "#ffffff";

      updateAmbientLights({ intensity: 0 });
      updateAmbient({ intensity: 0, color: "#ffffff" });
    });
};
