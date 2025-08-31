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
  useLuxel: () => useLuxel,
  useRegisterMesh: () => useRegisterMesh
});
module.exports = __toCommonJS(index_exports);

// src/core/useCoreGui.ts
var import_tweakpane = require("tweakpane");
var import_single = require("uid/single");

// src/stores/LightStore.ts
var import_zustand = require("zustand");
var useLightStore = (0, import_zustand.create)()((set) => ({
  lights: [],
  deletedLightKey: "",
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
  })),
  setDeleteKey: (key) => set((state) => ({
    deletedLightKey: state.deletedLightKey = key
  })),
  resetLight: () => set((state) => ({
    lights: []
  }))
}));

// src/core/useCoreGui.ts
var import_react2 = require("react");

// src/storage/useUpdatePreset.ts
var import_react = require("react");

// src/stores/PresetStore.ts
var import_zustand2 = require("zustand");
var usePresetStore = (0, import_zustand2.create)()((set) => ({
  preset: "",
  setPreset: (newPreset) => set(() => ({
    preset: newPreset
  }))
}));

// src/storage/useUpdatePreset.ts
var useUpdatePreset = () => {
  const timeoutRef = (0, import_react.useRef)(null);
  const preset = usePresetStore((state) => {
    return state.preset;
  });
  const delay = 300;
  const add = (light) => {
    const currentData = JSON.parse(
      localStorage.getItem(preset)
    );
    currentData.push(light);
    localStorage.setItem(preset, JSON.stringify(currentData));
  };
  const update = (0, import_react.useCallback)(
    (key, newProps) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        try {
          const currentData = JSON.parse(
            localStorage.getItem(preset)
          );
          const newData = currentData.map(
            (light) => light.key === key ? { ...light, ...newProps } : light
          );
          localStorage.setItem(preset, JSON.stringify(newData));
        } catch (err) {
          console.error(err, "Failed");
        }
      }, delay);
    },
    [preset, delay]
  );
  const updateAmbient = (0, import_react.useCallback)(
    (newProps) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        try {
          const currentData = JSON.parse(
            localStorage.getItem(preset)
          );
          const newData = currentData.map(
            (light) => light.type === "ambient" ? { ...light, ...newProps } : light
          );
          localStorage.setItem(preset, JSON.stringify(newData));
        } catch (err) {
          console.error(err, "Failed");
        }
      }, delay);
    },
    [preset, delay]
  );
  return { add, update, updateAmbient };
};

// src/stores/RegisterMeshStore.ts
var import_zustand3 = require("zustand");
var THREE = __toESM(require("three"));
var useRegisterMeshStore = (0, import_zustand3.create)()((set, get) => ({
  mesh: {},
  options: () => Object.fromEntries(Object.keys(get().mesh).map((k) => [k, k])),
  registerMesh: (obj, ref) => {
    set((state) => ({
      mesh: {
        ...state.mesh,
        [ref]: obj
      }
    }));
  },
  getMesh: (ref, exporting = false) => {
    const res = get().mesh[ref];
    if (!exporting) {
      if (res) {
        return res;
      } else {
        return new THREE.Object3D();
      }
    } else {
      if (res) {
        return `[${res.position.x},${res.position.y},${res.position.z}]
        `;
      } else {
        return `[0,0,0]`;
      }
    }
  }
}));

// src/export/download.ts
var download = (fileName, content) => {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

// src/export/useExport.ts
var useExport = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  });
  const getMesh = useRegisterMeshStore((state) => {
    return state.getMesh;
  });
  const imports = `
   import { Canvas, type CanvasProps } from "@react-three/fiber";
   import type { FC } from "react";
   import * as THREE from "three";

    `;
  return (name, extension) => {
    const lightElements = lights.map((light) => {
      switch (light.lightType) {
        case "directional":
          return `<directionalLight
                key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                target={targetObj(${getMesh(light.target.toLowerCase(), true)})}
                castShadow={${light.shadow}}
              ></directionalLight>`;
        case "hemisphere":
          return ` <hemisphereLight
                key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                groundColor={${light.groundColor}}
              />`;
        case "point":
          return ` <pointLight
                 key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                castShadow={${light.shadow}}
                distance={${light.distance}}
                decay={${light.decay}}
              />`;
        case "spot":
          return `<spotLight
                key={"${light.key}"}
                name={"${light.name}"}
                color={"${light.color}"}
                intensity={${light.intensity}}
                position={[
                  ${light.position.x},
                 ${light.position.y},
                  ${light.position.z},
                ]}
                target={targetObj(${getMesh(light.target.toLowerCase(), true)})}
                castShadow={${light.shadow}}
                penumbra={${light.penumbra}}
                angle={${light.angle}}
                distance={${light.distance}}
              ></spotLight>`;
      }
    }).join("\n");
    const content = `${imports}
    export const ${name.charAt(0).toUpperCase() + name.slice(1)}: FC<CanvasProps> = ({ children, ...props }) => {

    const targetObj = (pos: [number, number, number]) => {
    const obj = new THREE.Object3D();
    obj.position.set(...pos);
    return obj;
  };
        return (
        <>
        <Canvas {...props}
      style={{
        position: "relative",
      }}>
            ${lightElements}
            {children}
        </Canvas>
        </>
        )
    }
    `;
    download(
      name.charAt(0).toUpperCase() + name.slice(1) + "." + extension,
      content
    );
  };
};

// src/core/useCoreGui.ts
var PARAMS = {
  // prop lightType and type have their purposes
  key: (0, import_single.uid)(3),
  name: "",
  type: "directional",
  color: "#ffffff",
  intensity: 1
};
var useCoreGui = () => {
  const Hemisphere = {
    ...PARAMS,
    position: { x: 0, y: 0, z: 0 },
    lightType: "hemisphere",
    groundColor: "#ffffff"
  };
  const Directional = {
    ...PARAMS,
    lightType: "directional",
    position: { x: 3, y: 3, z: 3 },
    target: "",
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
    target: ""
  };
  const exportParams = (0, import_react2.useRef)({
    FileName: "Luxel",
    FileType: "tsx"
  });
  const EXPORT = {
    FileName: "Luxel",
    FileType: "tsx"
  };
  const exportLights = useExport();
  const addLight = useLightStore((state) => {
    return state.addLights;
  });
  const { add } = useUpdatePreset();
  const create6 = () => {
    const defaultPane = new import_tweakpane.Pane();
    defaultPane.element.style.position = "absolute";
    defaultPane.element.style.right = "80.5vw";
    defaultPane.element.style.width = "100%";
    const tab = defaultPane.addTab({
      pages: [{ title: "Create Light" }, { title: "Export" }]
    });
    tab.pages[0]?.addBinding(PARAMS, "name");
    tab.pages[0]?.addBinding(PARAMS, "color");
    tab.pages[0]?.addBinding(PARAMS, "intensity", {
      min: 0,
      max: 10,
      step: 0.1
    });
    tab.pages[0]?.addBinding(PARAMS, "type", {
      options: {
        DirectionalLight: "directional",
        PointLight: "point",
        SpotLight: "spot",
        HemisphereLight: "hemisphere"
      }
    });
    let lightObj = {};
    tab.pages[0]?.addButton({
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
      }
      addLight(lightObj);
      add(lightObj);
    });
    tab.pages[1]?.addBinding(EXPORT, "FileName").on("change", (ev) => {
      exportParams.current.FileName = ev.value;
    });
    tab.pages[1]?.addBinding(EXPORT, "FileType", {
      options: {
        TSX: "tsx",
        JSX: "jsx"
      }
    }).on("change", (ev) => {
      exportParams.current.FileType = ev.value;
      console.log(exportParams.current.FileType);
    });
    tab.pages[1]?.addButton({
      title: "Export",
      label: "Export"
    }).on("click", (ev) => {
      const str = exportLights(
        exportParams.current.FileName,
        exportParams.current.FileType
      );
      console.log(str);
    });
    return defaultPane;
  };
  (0, import_react2.useEffect)(() => {
    const pane = create6();
    return () => {
      pane.dispose();
    };
  });
};

// src/core/CoreCanvas.tsx
var import_fiber2 = require("@react-three/fiber");

// src/core/CoreLights.tsx
var import_react4 = require("react");

// src/core/useLightHelper.ts
var THREE2 = __toESM(require("three"));
var import_fiber = require("@react-three/fiber");

// src/stores/HelperStore.ts
var import_zustand4 = require("zustand");
var useHelperStore = (0, import_zustand4.create)()((set) => ({
  helperArr: [],
  selectedLight: "",
  helperScale: 1,
  scene: {},
  setHelperScale: (scale) => set((state) => ({
    helperScale: state.helperScale = scale
  })),
  setSelectedLight: (key) => set((state) => ({ selectedLight: state.selectedLight = key })),
  deleteHelpers: (helper) => set((state) => ({
    helperArr: state.helperArr.filter((help) => help !== helper)
  })),
  addHelper: (helper) => set((state) => ({
    helperArr: [...state.helperArr, helper]
  })),
  setScene: (scene) => set((state) => ({ scene }))
}));

// src/core/useLightHelper.ts
var import_react3 = require("react");
function useLightHelper() {
  const raycaster = new THREE2.Raycaster();
  const pointer = new THREE2.Vector2();
  const helperArr = useHelperStore.getState().helperArr;
  const addHelper = useHelperStore.getState().addHelper;
  const deleteHelpers = useHelperStore.getState().deleteHelpers;
  const setScene = useHelperStore((state) => {
    return state.setScene;
  });
  const setSelectedLight = useHelperStore((state) => {
    return state.setSelectedLight;
  });
  const { scene, camera } = (0, import_fiber.useThree)();
  (0, import_react3.useEffect)(() => {
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
    return () => {
      window.removeEventListener("click", onMouseClick);
    };
  }, [helperArr]);
  return (ref, key, size = 1) => {
    if (!ref.current) return;
    let helper = null;
    ref.current.forEach((light, idx) => {
      if (light) {
        switch (light.type) {
          case "DirectionalLight":
            helper = new THREE2.DirectionalLightHelper(
              light,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;
          case "HemisphereLight":
            helper = new THREE2.HemisphereLightHelper(
              light,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;
          case "PointLight":
            helper = new THREE2.PointLightHelper(
              light,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;
          case "SpotLight":
            helper = new THREE2.SpotLightHelper(light);
            helper.userData = { key: key[idx], isHelper: true };
        }
      }
    });
    if (helper) {
      addHelper(helper);
      scene.add(helper);
      setScene(scene);
      let fId;
      const animate = () => {
        helper.update();
        fId = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => {
      if (helper) {
        helper.dispose();
        deleteHelpers(helper);
        scene.remove(helper);
      }
    };
  };
}

// src/stores/AmbientStore.ts
var import_zustand5 = require("zustand");
var useAmbientStore = (0, import_zustand5.create)()((set) => ({
  AmbientLight: {},
  updateAmbientLights: (newProps) => set((state) => ({
    AmbientLight: { ...state.AmbientLight, ...newProps }
  }))
}));

// src/core/CoreLights.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var CoreLights = () => {
  const lights = useLightStore((state) => {
    return state.lights;
  });
  const deletedLightKey = useLightStore((state) => {
    return state.deletedLightKey;
  });
  const ambientLight = useAmbientStore().AmbientLight;
  const getMesh = useRegisterMeshStore((state) => {
    return state.getMesh;
  });
  const keys = lights.map((light) => light.key);
  const helperScale = useHelperStore((state) => {
    return state.helperScale;
  });
  const helper = useLightHelper();
  const lightsRef = (0, import_react4.useRef)([]);
  const trackLightsRef = (el) => {
    if (el) {
      if (!lightsRef.current.some((light) => light.uuid === el.uuid)) {
        const len = lightsRef.current.length;
        el.userData.key = keys[len];
        lightsRef.current.push(el);
        helper(lightsRef, keys, helperScale);
      }
    }
  };
  (0, import_react4.useEffect)(() => {
    if (deletedLightKey !== "") {
      lightsRef.current = lightsRef.current.filter((light) => {
        if (light.userData.key !== deletedLightKey) {
          return light;
        }
      });
    }
  });
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "ambientLight",
      {
        intensity: ambientLight.intensity ? ambientLight.intensity : 0,
        color: ambientLight.color
      }
    ),
    lights.map((light) => {
      switch (light.lightType) {
        case "directional":
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "directionalLight",
            {
              ref: trackLightsRef,
              name: light.name,
              color: light.color,
              intensity: light.intensity,
              position: [
                light.position.x,
                light.position.y,
                light.position.z
              ],
              target: getMesh(light.target.toLowerCase()),
              castShadow: light.shadow
            },
            light.key
          );
        case "hemisphere":
          return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "hemisphereLight",
            {
              ref: trackLightsRef,
              position: [
                light.position.x,
                light.position.y,
                light.position.z
              ],
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
              position: [
                light.position.x,
                light.position.y,
                light.position.z
              ],
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
              position: [
                light.position.x,
                light.position.y,
                light.position.z
              ],
              target: getMesh(light.target.toLowerCase()),
              penumbra: light.penumbra,
              angle: light.angle,
              distance: light.distance,
              castShadow: light.shadow
            },
            light.key
          );
      }
    })
  ] });
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
var import_react5 = require("react");

// src/storage/useDeletePreset.ts
var useDeletePreset = () => {
  const preset = usePresetStore((state) => {
    return state.preset;
  });
  return (key) => {
    const currentData = JSON.parse(
      localStorage.getItem(preset)
    );
    const newData = currentData.filter((light) => light.key !== key);
    localStorage.setItem(preset, JSON.stringify(newData));
  };
};

// src/factory/useFactoryGui.ts
var useFactoryGui = () => {
  const updateAmbientLights = useAmbientStore((state) => {
    return state.updateAmbientLights;
  });
  const ambient = useAmbientStore((state) => {
    return state.AmbientLight;
  });
  const AmbientLight = {
    color: ambient.color ? ambient.color : "#ffffff",
    intensity: ambient.intensity ? ambient.intensity : 0
  };
  const lightKey = useHelperStore((state) => {
    return state.selectedLight;
  });
  const lightData = useLightStore((state) => {
    return state.lights;
  });
  const updateLights = useLightStore((state) => {
    return state.updateLights;
  });
  const deleteLights = useLightStore((state) => {
    return state.deleteLight;
  });
  const SelectedLight = lightData.filter((SelectedLight2) => {
    if (SelectedLight2.key === lightKey) {
      return SelectedLight2;
    }
  })[0];
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
  const options = useRegisterMeshStore((state) => {
    return state.options;
  });
  const factory = new import_tweakpane2.Pane({
    title: `Name:${SelectedLight?.name} ID: ${SelectedLight?.key} type:${SelectedLight?.lightType}`
  });
  factory.element.style.width = "150%";
  factory.element.style.translate = "-40% 0%";
  (0, import_react5.useEffect)(() => {
    if (!SelectedLight) {
      return;
    }
    factory.addBinding(AmbientLight, "color", {
      label: "AmbientLight Color"
    }).on("change", (ev) => {
      if (ev.value) updateAmbientLights({ color: ev.value });
      updateAmbient({ color: ev.value });
    });
    factory.addBinding(AmbientLight, "intensity", {
      step: 0.01,
      label: "AmbientLight Intensity"
    }).on("change", (ev) => {
      if (ev.value) updateAmbientLights({ intensity: ev.value });
      updateAmbient({ intensity: ev.value });
    });
    Object.keys(SelectedLight).forEach((key) => {
      if (key !== "name" && key !== "key" && key !== "lightType" && key !== "type" && key !== "target") {
        factory.addBinding(SelectedLight, key).on("change", (ev) => {
          updateLights(SelectedLight.key, { [key]: ev.value });
          update(SelectedLight.key, { [key]: ev.value });
        });
      } else if (key === "target") {
        factory.addBinding(SelectedLight, key, {
          options: { default: "", ...options() }
        }).on("change", (ev) => {
          updateLights(SelectedLight.key, { [key]: ev.value });
          update(SelectedLight.key, { [key]: ev.value });
        });
      }
    });
    factory.addButton({
      title: "Delete Lights"
    }).on("click", () => {
      deleteLights(lightKey);
      setDeleteKey(lightKey);
      deleteStorage(lightKey);
      const helper = helperArr.filter((helper2) => {
        if (helper2.userData.key === lightKey) {
          return helper2;
        }
      });
      if (helper[0]) {
        helper[0].dispose();
        scene.remove(helper[0]);
        deleteHelpers(helper[0]);
      }
    });
    factory.addButton({
      title: "Reset AmbientLight"
    }).on("click", () => {
      AmbientLight.intensity = 0;
      AmbientLight.color = "#ffffff";
      updateAmbientLights({ intensity: 0 });
      updateAmbient({ intensity: 0, color: "#ffffff" });
    });
    return () => {
      factory.dispose();
    };
  }, [lightKey, helperArr]);
};

// src/storage/useLoadPreset.ts
var import_react6 = require("react");
var useLoadPreset = (preset) => {
  const addLights = useLightStore((state) => {
    return state.addLights;
  });
  const resetLights = useLightStore((state) => {
    return state.resetLight;
  });
  const updateAmbientLights = useAmbientStore((state) => {
    return state.updateAmbientLights;
  });
  const setPreset = usePresetStore((state) => {
    return state.setPreset;
  });
  const [data, setData] = (0, import_react6.useState)([
    {
      color: "#ffffff",
      intensity: 0,
      lightType: "ambient",
      type: "ambient"
    }
  ]);
  (0, import_react6.useEffect)(() => {
    const storedPreset = localStorage.getItem(preset);
    setPreset(preset);
    if (storedPreset) {
      try {
        const parsedPreset = JSON.parse(storedPreset);
        setData(parsedPreset);
        resetLights();
        parsedPreset.map((light) => {
          if (light.lightType !== "ambient") {
            addLights(light);
          } else {
            updateAmbientLights(light);
          }
        });
      } catch (err) {
        console.error(err, "Invalid JSON string passed to be parsed", preset);
      }
    } else {
      console.log(data);
      const defaultData = JSON.stringify(data);
      localStorage.setItem(preset, defaultData);
    }
  }, [preset]);
};

// src/useLuxel.ts
var useLuxel = (preset, helperScale = 1) => {
  const setHelperScale = useHelperStore((state) => {
    return state.setHelperScale;
  });
  setHelperScale(helperScale);
  useLoadPreset(preset);
  useCoreGui();
  useFactoryGui();
  return CoreCanvas;
};

// src/useRegisterMesh.ts
var useRegisterMesh = (mesh, ref) => {
  const registerMesh = useRegisterMeshStore((state) => {
    return state.registerMesh;
  });
  registerMesh(mesh, ref.toLowerCase());
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useLuxel,
  useRegisterMesh
});
