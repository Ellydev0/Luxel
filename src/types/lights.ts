/**
 * Type definition for the various light supported by Luxel,
 * all extend from the main light type,
 */

import { MainLight } from "./main";

export interface AmbientLight extends MainLight {
  lightType: "ambient";
}

export interface HemisphereLight extends MainLight {
  //color from the main light type is the skylight
  groundColor: string;
  lightType: "hemisphere";
}

export interface DirectionalLight extends MainLight {
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  shadow: boolean;
  lightType: "directional";
}

export interface PointLight extends MainLight {
  distance: number;
  position: { x: number; y: number; z: number };
  shadow: boolean;
  decay: number;
  lightType: "point";
}

export interface SpotLight extends MainLight {
  distance: number;
  angle: number; //radians
  penumbra: number;
  position: { x: number; y: number; z: number };
  shadow: boolean;
  target: { x: number; y: number; z: number };
  lightType: "spot";
}

export type LightPropsMap = {
  point: PointLight;
  spot: SpotLight;
  hemisphere: HemisphereLight;
  directional: DirectionalLight;
  ambient: AmbientLight;
};

export type LightData =
  | AmbientLight
  | HemisphereLight
  | DirectionalLight
  | PointLight
  | SpotLight;
