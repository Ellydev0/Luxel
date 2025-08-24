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
import { useEffect } from "react";

const PARAMS: MainLight = {
  // prop lightType and type have their purposes
  key: uid(3),
  name: "",
  type: "directional",
  color: "#ffffff",
  intensity: 1,
};
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
  const addLight = useLightStore((state: { addLights: any }) => {
    return state.addLights;
  });

  //A function that creates the luxel core gui
  const create = () => {
    const defaultPane = new Pane({
      title: "Create Light",
    });

    defaultPane.element.style.position = "absolute";
    defaultPane.element.style.right = "80.5vw";
    defaultPane.element.style.width = "100%";

    //GUI for the main light props
    defaultPane.addBinding(PARAMS, "name");

    defaultPane.addBinding(PARAMS, "color");

    defaultPane.addBinding(PARAMS, "intensity", {
      min: 0,
      max: 10,
      step: 0.1,
    });

    defaultPane.addBinding(PARAMS, "type", {
      options: {
        DirectionalLight: "directional",
        PointLight: "point",
        SpotLight: "spot",
        HemisphereLight: "hemisphere",
      },
    });

    // a button that stores light data to zustand, and calls the useCore hook to create a light component

    let lightObj = {} as MainLight;
    defaultPane
      .addButton({
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
