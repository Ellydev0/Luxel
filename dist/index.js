"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  useLuxel: () => useLuxel
});
module.exports = __toCommonJS(index_exports);

// src/core/useCoreGui.ts
var import_tweakpane = require("tweakpane");
var import_single = require("uid/single");

// src/stores/LightStore.ts
var import_zustand = require("zustand");
var useLightStore = (0, import_zustand.create)()((set) => ({
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
var import_react = require("react");
var PARAMS = {
  // prop lightType and type have their purposes
  key: (0, import_single.uid)(3),
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
    const defaultPane = new import_tweakpane.Pane({
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
      PARAMS.key = (0, import_single.uid)(3);
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
  (0, import_react.useEffect)(() => {
    const pane = create3();
    return () => {
      pane.dispose();
    };
  });
};

// src/core/CoreCanvas.tsx
var import_fiber2 = require("@react-three/fiber");

// src/core/CoreLights.tsx
var import_react2 = require("react");

// src/core/useLightHelper.ts
var THREE = __toESM(require("three"));
var import_fiber = require("@react-three/fiber");

// src/stores/HelperStore.ts
var import_zustand2 = require("zustand");
var useHelperStore = (0, import_zustand2.create)()((set) => ({
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
  const { scene, camera } = (0, import_fiber.useThree)();
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
var import_jsx_runtime = require("react/jsx-runtime");
var CoreLights = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  });
  const keys = lights.map((light) => light.key);
  const helper = useLightHelper();
  const lightsRef = (0, import_react2.useRef)([]);
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "ambientLight",
          {
            name: light.name,
            color: light.color,
            intensity: light.intensity
          },
          light.key
        );
      case "directional":
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
        return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_jsx_runtime2 = require("react/jsx-runtime");
var CoreCanvas = ({ children, ...props }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    import_fiber2.Canvas,
    {
      ...props,
      style: {
        position: "relative"
      },
      children: [
        children,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(CoreLights, {})
      ]
    }
  );
};

// src/factory/useFactoryGui.ts
var import_tweakpane2 = require("tweakpane");
var import_react3 = require("react");
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
  const factory = new import_tweakpane2.Pane({ title: `Name:${SelectedLight?.name}` });
  (0, import_react3.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useLuxel
});
