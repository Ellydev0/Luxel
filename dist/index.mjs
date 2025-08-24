// src/core/useCoreGui.ts
import { Pane } from "tweakpane";
import { uid } from "uid/single";

// src/stores/LightStore.ts
import { create } from "zustand";
var useLightStore = create()((set) => ({
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
  }))
}));

// src/core/useCoreGui.ts
import { useEffect } from "react";
var PARAMS = {
  // prop lightType and type have their purposes
  key: uid(3),
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
  const addLight = useLightStore((state) => {
    return state.addLights;
  });
  const create5 = () => {
    const defaultPane = new Pane({
      title: "Create Light"
    });
    defaultPane.element.style.position = "absolute";
    defaultPane.element.style.right = "80.5vw";
    defaultPane.element.style.width = "100%";
    defaultPane.addBinding(PARAMS, "name");
    defaultPane.addBinding(PARAMS, "color");
    defaultPane.addBinding(PARAMS, "intensity", {
      min: 0,
      max: 10,
      step: 0.1
    });
    defaultPane.addBinding(PARAMS, "type", {
      options: {
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
      }
      addLight(lightObj);
    });
    return defaultPane;
  };
  useEffect(() => {
    const pane = create5();
    return () => {
      pane.dispose();
    };
  });
};

// src/core/CoreCanvas.tsx
import { Canvas } from "@react-three/fiber";

// src/core/CoreLights.tsx
import { useEffect as useEffect3, useRef } from "react";

// src/core/useLightHelper.ts
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

// src/stores/HelperStore.ts
import { create as create2 } from "zustand";
var useHelperStore = create2()((set) => ({
  helperArr: [],
  selectedLight: "",
  scene: {},
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
import { useEffect as useEffect2 } from "react";
function useLightHelper() {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const helperArr = useHelperStore.getState().helperArr;
  const addHelper = useHelperStore.getState().addHelper;
  const deleteHelpers = useHelperStore.getState().deleteHelpers;
  const setScene = useHelperStore((state) => {
    return state.setScene;
  });
  const setSelectedLight = useHelperStore((state) => {
    return state.setSelectedLight;
  });
  const { scene, camera } = useThree();
  useEffect2(() => {
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
import { create as create3 } from "zustand";
var useAmbientStore = create3()((set) => ({
  AmbientLight: {},
  updateAmbientLights: (newProps) => set((state) => ({
    AmbientLight: { ...state.AmbientLight, ...newProps }
  }))
}));

// src/stores/RegisterMeshStore.ts
import { create as create4 } from "zustand";
import * as THREE2 from "three";
var useRegisterMeshStore = create4()((set, get) => ({
  mesh: {},
  registerMesh: (obj, ref) => {
    set((state) => ({
      mesh: {
        ...state.mesh,
        [ref]: obj
      }
    }));
  },
  getMesh: (ref) => {
    const res = get().mesh[ref];
    if (res) {
      return res;
    } else {
      return new THREE2.Object3D();
    }
  }
}));

// src/core/CoreLights.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
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
  const helper = useLightHelper();
  const lightsRef = useRef([]);
  const trackLightsRef = (el) => {
    if (el) {
      if (!lightsRef.current.some((light) => light.uuid === el.uuid)) {
        const len = lightsRef.current.length;
        el.userData.key = keys[len];
        lightsRef.current.push(el);
        helper(lightsRef, keys);
      }
    }
  };
  useEffect3(() => {
    if (deletedLightKey !== "") {
      lightsRef.current = lightsRef.current.filter((light) => {
        if (light.userData.key !== deletedLightKey) {
          return light;
        }
      });
    }
  });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "ambientLight",
      {
        intensity: ambientLight.intensity ? ambientLight.intensity : 0,
        color: ambientLight.color
      }
    ),
    lights.map((light) => {
      switch (light.lightType) {
        case "directional":
          return /* @__PURE__ */ jsx(
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
          return /* @__PURE__ */ jsx(
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
          return /* @__PURE__ */ jsx(
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
          return /* @__PURE__ */ jsx(
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
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var CoreCanvas = ({ children, ...props }) => {
  return /* @__PURE__ */ jsxs2(
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
import { useEffect as useEffect4 } from "react";
var useFactoryGui = () => {
  const updateAmbientLights = useAmbientStore((state) => {
    return state.updateAmbientLights;
  });
  const AmbientLight = {
    color: "#ffffff",
    intensity: 0
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
  const factory = new Pane2();
  const folder = factory.addTab({
    pages: [
      { title: `Name:${SelectedLight?.name}` },
      { title: "AmbientLight Settings" }
    ]
  });
  useEffect4(() => {
    if (!SelectedLight) {
      return;
    }
    Object.keys(SelectedLight).forEach((key) => {
      if (key !== "name" && key !== "key" && key !== "lightType" && key !== "type") {
        folder.pages[0]?.addBinding(SelectedLight, key).on("change", (ev) => {
          updateLights(SelectedLight.key, { [key]: ev.value });
        });
      }
    });
    folder.pages[0]?.addButton({
      title: "Delete Lights"
    }).on("click", () => {
      deleteLights(lightKey);
      setDeleteKey(lightKey);
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
    return () => {
      factory.dispose();
    };
  }, [lightKey, helperArr]);
  folder.pages[1]?.addBinding(AmbientLight, "color").on("change", (ev) => {
    if (ev.value) updateAmbientLights({ color: ev.value });
  });
  folder.pages[1]?.addBinding(AmbientLight, "intensity", {
    step: 0.01
  }).on("change", (ev) => {
    if (ev.value) updateAmbientLights({ intensity: ev.value });
  });
  folder.pages[1]?.addButton({
    title: "Reset AmbientLight"
  }).on("click", () => {
    AmbientLight.intensity = 0;
    updateAmbientLights({ intensity: 0 });
  });
};

// src/useLuxel.ts
var useLuxel = (preset) => {
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
export {
  useLuxel,
  useRegisterMesh
};
