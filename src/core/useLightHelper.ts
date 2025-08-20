/**
 * A hook that helps in the assignment of helpers to the lights in the scene
 */

import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useHelperStore } from "../stores/HelperStore";
import { RefObject } from "react";

export function useLightHelper() {
  /**
   * A hook that helps in the assignment of helpers to the lights in the scene
   */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  //getting the helpers array and setSelectedLight from zustand
  const helperArr: THREE.Object3D[] = [];
  const setSelectedLight = useHelperStore((state) => {
    return state.setSelectedLight;
  });

  //returns a function that creates the helper based on the light type
  const { scene, camera } = useThree();

  const onMouseClick = (ev: MouseEvent) => {
    //normalizing pointer coord (-1 to 1)
    pointer.x = (ev.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1;

    //updating the raycaster
    raycaster.setFromCamera(pointer, camera);

    //preparing intersection for the helpers
    const intersects = raycaster.intersectObjects(helperArr, true);

    if (intersects.length > 0) {
      const clickObj = intersects[0]?.object;

      const helperClicked = clickObj?.userData.isHelper
        ? clickObj
        : clickObj?.parent;

      if (helperClicked) {
        setSelectedLight(helperClicked.userData.key);
      }
    }
  };

  window.addEventListener("click", onMouseClick);

  return (
    ref: RefObject<THREE.Light<THREE.LightShadow<THREE.Camera> | undefined>[]>,
    key: string[],
    size: number = 1
  ) => {
    if (!ref.current) return;
    let helper: THREE.Object3D | null = null;
    ref.current.forEach((light, idx) => {
      if (light) {
        switch (light.type) {
          case "DirectionalLight":
            helper = new THREE.DirectionalLightHelper(
              light as THREE.DirectionalLight,
              size
            );

            helper.userData = { key: key[idx], isHelper: true };
            break;

          case "HemisphereLight":
            helper = new THREE.HemisphereLightHelper(
              light as THREE.HemisphereLight,
              size
            );
            helper.userData = { key: key[idx], isHelper: true };
            break;

          case "PointLight":
            helper = new THREE.PointLightHelper(
              light as THREE.PointLight,
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

      let fId: number;
      const animate = () => {
        (helper as any).update();
        fId = requestAnimationFrame(animate);
      };
      animate();

      helperArr.push(helper);
    }
    return () => {
      if (helper) {
        scene.remove(helper);
        (helper as any).dispose();
      }
    };
  };
}
