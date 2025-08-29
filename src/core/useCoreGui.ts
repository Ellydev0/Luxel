/**
 * A gui that prompts the user for name, type, intensity, colour of the light and provides a button for the creation to create the light data
 */

import { Pane } from "tweakpane";
import { MainLight } from "../types/main";
import { uid } from "uid/single";
import {
  DirectionalLight,
  HemisphereLight,
  PointLight,
  SpotLight,
} from "../types/lights";
import { useLightStore } from "../stores/LightStore";
import { useEffect, useRef } from "react";
import { useUpdatePreset } from "../storage/useUpdatePreset";
import { useExport } from "../export/useExport";

const PARAMS: MainLight = {
  // prop lightType and type have their purposes
  key: uid(3),
  name: "",
  type: "directional",
  color: "#ffffff",
  intensity: 1,
};
/**
 * This hook creates a tweakpane gui that provides blades to create a light and prepare the data for zustand
 */
export const useCoreGui = () => {
  const Hemisphere: HemisphereLight = {
    ...PARAMS,
    position: { x: 0, y: 0, z: 0 },

    lightType: "hemisphere",
    groundColor: "#ffffff",
  };

  const Directional: DirectionalLight = {
    ...PARAMS,
    lightType: "directional",
    position: { x: 3, y: 3, z: 3 },
    target: "",
    shadow: false,
  };

  const Point: PointLight = {
    ...PARAMS,
    lightType: "point",
    distance: 0.0,
    position: { x: 1, y: 1, z: 0 },
    shadow: false,
    decay: 2.0,
  };

  const Spot: SpotLight = {
    ...PARAMS,
    lightType: "spot",
    distance: 0,
    angle: 0.3, //radians
    penumbra: 1,
    position: { x: 3, y: 3, z: 3 },
    shadow: false,
    target: "",
  };

  /**
   * EXPORT TAB
   */
  interface EXPORT_PARAMS {
    FileName: string;
    FileType: "tsx" | "jsx";
  }

  const exportParams = useRef<EXPORT_PARAMS>({
    FileName: "Luxel",
    FileType: "tsx",
  });

  const EXPORT: EXPORT_PARAMS = {
    FileName: "Luxel",
    FileType: "tsx",
  };

  const exportLights = useExport();

  /**
   * LIGHTS
   */
  const addLight = useLightStore((state: { addLights: any }) => {
    return state.addLights;
  });
  const { add } = useUpdatePreset() as any;

  //A function that creates the luxel core gui

  const create = () => {
    const defaultPane = new Pane();

    //styles
    defaultPane.element.style.position = "absolute";
    defaultPane.element.style.right = "80.5vw";
    defaultPane.element.style.width = "100%";

    const tab = defaultPane.addTab({
      pages: [{ title: "Create Light" }, { title: "Export" }],
    });

    //GUI for the main light props
    tab.pages[0]?.addBinding(PARAMS, "name");

    tab.pages[0]?.addBinding(PARAMS, "color");

    tab.pages[0]?.addBinding(PARAMS, "intensity", {
      min: 0,
      max: 10,
      step: 0.1,
    });

    tab.pages[0]?.addBinding(PARAMS, "type", {
      options: {
        DirectionalLight: "directional",
        PointLight: "point",
        SpotLight: "spot",
        HemisphereLight: "hemisphere",
      },
    });

    // a button that stores light data to zustand

    let lightObj = {} as MainLight;

    tab.pages[0]
      ?.addButton({
        title: "Create",
        label: "Create Light",
      })
      .on("click", () => {
        PARAMS.key = uid(3);
        if (PARAMS.type === "directional") {
          lightObj = { ...Directional, ...PARAMS };
        } else if (PARAMS.type === "hemisphere") {
          lightObj = { ...Hemisphere, ...PARAMS };
        } else if (PARAMS.type === "point") {
          lightObj = { ...Point, ...PARAMS };
        } else if (PARAMS.type === "spot") {
          lightObj = { ...Spot, ...PARAMS };
        }
        addLight(lightObj); // sends light data to zustand
        add(lightObj);
      });

    /**
     * EXPORT TAB
     */
    tab.pages[1]?.addBinding(EXPORT, "FileName").on("change", (ev) => {
      exportParams.current.FileName = ev.value;
    });

    tab.pages[1]
      ?.addBinding(EXPORT, "FileType", {
        options: {
          TSX: "tsx",
          JSX: "jsx",
        },
      })
      .on("change", (ev) => {
        exportParams.current.FileType = ev.value;
        console.log(exportParams.current.FileType);
      });

    tab.pages[1]
      ?.addButton({
        title: "Export",
        label: "Export",
      })
      .on("click", (ev) => {
        const str = exportLights(
          exportParams.current.FileName,
          exportParams.current.FileType
        );
        console.log(str);
      });

    return defaultPane;
  };

  useEffect(() => {
    const pane = create();
    return () => {
      pane.dispose();
    };
  });
};
