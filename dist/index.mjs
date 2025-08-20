// src/core/useCoreGui.ts
import { Pane } from "tweakpane";
import { uid } from "uid/single";

// src/stores/LightStore.ts
import { create } from "zustand";
var useLightStore = create()((set) => ({
  lights: [],
  updateLights: (id, newProps) => set((state) => ({
    lights: state.lights.map(
      (light) => light.key === id ? { ...light, ...newProps } : light
    )
  })),
  addLights: (props) => set((state) => ({
    lights: [...state.lights, props]
  })),
  deleteLight: (id) => set((state) => ({
    lights: state.lights.filter((light) => light.key !== id)
  }))
}));

// src/core/useCoreGui.ts
import { useEffect } from "react";
var PARAMS = {
  // prop lightType and type have their purposes
  key: uid(3),
  name: "",
  type: "ambient",
  color: "#ffffff",
  intensity: 1
};
var useCoreGui = () => {
  const Hemisphere = {
    ...PARAMS,
    lightType: "hemisphere",
    groundColor: "#ffffff"
  };
  const Directional = {
    ...PARAMS,
    lightType: "directional",
    position: { x: 3, y: 3, z: 3 },
    target: { x: 0, y: 0, z: 0 },
    shadow: false
  };
  const Point = {
    ...PARAMS,
    lightType: "point",
    distance: 0,
    position: { x: 1, y: 1, z: 0 },
    shadow: false,
    decay: 2
  };
  const Spot = {
    ...PARAMS,
    lightType: "spot",
    distance: 0,
    angle: 0.3,
    //radians
    penumbra: 1,
    position: { x: 3, y: 3, z: 3 },
    shadow: false,
    target: { x: 0, y: 3, z: 3 }
  };
  const addLight = useLightStore((state) => {
    return state.addLights;
  });
  const create3 = () => {
    const defaultPane = new Pane({
      title: "Create Light"
    });
    defaultPane.element.style.position = "absolute";
    defaultPane.element.style.right = "80.5vw";
    defaultPane.addBinding(PARAMS, "name");
    defaultPane.addBinding(PARAMS, "color");
    defaultPane.addBinding(PARAMS, "intensity", {
      min: 0,
      max: 100,
      step: 0.1
    });
    defaultPane.addBinding(PARAMS, "type", {
      options: {
        AmbientLight: "ambient",
        DirectionalLight: "directional",
        PointLight: "point",
        SpotLight: "spot",
        HemisphereLight: "hemisphere"
      }
    });
    let lightObj = {};
    defaultPane.addButton({
      title: "Create",
      label: "Create Light"
    }).on("click", () => {
      PARAMS.key = uid(3);
      if (PARAMS.type === "directional") {
        lightObj = { ...Directional, ...PARAMS };
      } else if (PARAMS.type === "hemisphere") {
        lightObj = { ...Hemisphere, ...PARAMS };
      } else if (PARAMS.type === "point") {
        lightObj = { ...Point, ...PARAMS };
      } else if (PARAMS.type === "spot") {
        lightObj = { ...Spot, ...PARAMS };
      } else {
        lightObj = { ...PARAMS };
      }
      console.log(lightObj);
      addLight(lightObj);
    });
    return defaultPane;
  };
  useEffect(() => {
    const pane = create3();
    return () => {
      pane.dispose();
    };
  });
};

// src/core/CoreCanvas.tsx
import { Canvas } from "@react-three/fiber";

// src/core/CoreLights.tsx
import { useRef } from "react";

// src/core/useLightHelper.ts
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

// src/stores/HelperStore.ts
import { create as create2 } from "zustand";
var useHelperStore = create2()((set) => ({
  helperArr: [],
  selectedLight: "",
  setSelectedLight: (key) => set((state) => ({ selectedLight: state.selectedLight = key }))
}));

// src/core/useLightHelper.ts
function useLightHelper() {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const helperArr = [];
  const setSelectedLight = useHelperStore((state) => {
    return state.setSelectedLight;
  });
  const { scene, camera } = useThree();
  const onMouseClick = (ev) => {
    pointer.x = ev.clientX / window.innerWidth * 2 - 1;
    pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(helperArr, true);
    if (intersects.length > 0) {
      const clickObj = intersects[0]?.object;
      const helperClicked = clickObj?.userData.isHelper ? clickObj : clickObj?.parent;
      if (helperClicked) {
        setSelectedLight(helperClicked.userData.key);
      }
    }
  };
  window.addEventListener("click", onMouseClick);
  return (ref, key, size = 1) => {
    if (!ref.current) return;
    let helper = null;
    ref.current.forEach((light, idx) => {
      if (light) {
        switch (light.type) {
          case "DirectionalLight":
            helper = new THREE.DirectionalLightHelper(
              light,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;
          case "HemisphereLight":
            helper = new THREE.HemisphereLightHelper(
              light,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;
          case "PointLight":
            helper = new THREE.PointLightHelper(
              light,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;
          case "SpotLight":
            helper = new THREE.SpotLightHelper(light);
            helper.userData = { key: key[idx], isHelper: true };
        }
      }
    });
    if (helper) {
      scene.add(helper);
      let fId;
      const animate = () => {
        helper.update();
        fId = requestAnimationFrame(animate);
      };
      animate();
      helperArr.push(helper);
    }
    return () => {
      if (helper) {
        scene.remove(helper);
        helper.dispose();
      }
    };
  };
}

// src/core/CoreLights.tsx
import { jsx } from "react/jsx-runtime";
var CoreLights = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  });
  const keys = lights.map((light) => light.key);
  const helper = useLightHelper();
  const lightsRef = useRef([]);
  const trackLightsRef = (el) => {
    if (el) {
      if (!lightsRef.current.some((light) => light.uuid === el.uuid)) {
        lightsRef.current.push(el);
        helper(lightsRef, keys);
      }
    } else {
      lightsRef.current = lightsRef.current.filter((light) => light !== el);
    }
  };
  return lights.map((light) => {
    switch (light.lightType) {
      case "ambient":
        return /* @__PURE__ */ jsx(
          "ambientLight",
          {
            name: light.name,
            color: light.color,
            intensity: light.intensity
          },
          light.key
        );
      case "directional":
        return /* @__PURE__ */ jsx(
          "directionalLight",
          {
            ref: trackLightsRef,
            name: light.name,
            color: light.color,
            intensity: light.intensity,
            position: [light.position.x, light.position.y, light.position.z],
            castShadow: light.shadow
          },
          light.key
        );
      case "hemisphere":
        return /* @__PURE__ */ jsx(
          "hemisphereLight",
          {
            ref: trackLightsRef,
            name: light.name,
            color: light.color,
            groundColor: light.groundColor,
            intensity: light.intensity
          },
          light.key
        );
      case "point":
        return /* @__PURE__ */ jsx(
          "pointLight",
          {
            name: light.name,
            ref: trackLightsRef,
            color: light.color,
            position: [light.position.x, light.position.y, light.position.z],
            intensity: light.intensity,
            distance: light.distance,
            decay: light.decay,
            castShadow: light.shadow
          },
          light.key
        );
      case "spot":
        return /* @__PURE__ */ jsx(
          "spotLight",
          {
            ref: trackLightsRef,
            name: light.name,
            color: light.color,
            intensity: light.intensity,
            position: [light.position.x, light.position.y, light.position.z],
            penumbra: light.penumbra,
            angle: light.angle,
            distance: light.distance,
            castShadow: light.shadow
          },
          light.key
        );
      default:
        return /* @__PURE__ */ jsx(
          "ambientLight",
          {
            name: light.name,
            color: light.color,
            intensity: light.intensity
          },
          light.key
        );
    }
  });
};

// src/core/CoreCanvas.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var CoreCanvas = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxs(
    Canvas,
    {
      ...props,
      style: {
        position: "relative"
      },
      children: [
        children,
        /* @__PURE__ */ jsx2(CoreLights, {})
      ]
    }
  );
};

// src/factory/useFactoryGui.ts
import { Pane as Pane2 } from "tweakpane";
import { useEffect as useEffect2 } from "react";
var useFactoryGui = () => {
  const lightKey = useHelperStore((state) => {
    return state.selectedLight;
  });
  const lightData = useLightStore((state) => {
    return state.lights;
  });
  const updateLights = useLightStore((state) => {
    return state.updateLights;
  });
  const SelectedLight = lightData.filter((SelectedLight2) => {
    if (SelectedLight2.key === lightKey) {
      return SelectedLight2;
    }
  })[0];
  const factory = new Pane2({ title: `Name:${SelectedLight?.name}` });
  useEffect2(() => {
    if (!SelectedLight) {
      return;
    }
    Object.keys(SelectedLight).forEach((key) => {
      if (key !== "name" && key !== "key" && key !== "lightType" && key !== "type") {
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

// src/useLuxel.ts
var useLuxel = (preset) => {
  useCoreGui();
  useFactoryGui();
  return CoreCanvas;
};
export {
  useLuxel
};
