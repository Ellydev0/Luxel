export type Lights =
  | "ambient"
  | "directional"
  | "spot"
  | "hemisphere"
  | "point";

export interface MainLight {
  key: string;
  type: Lights;
  name: string;
  color: string;
  intensity: number;
}
