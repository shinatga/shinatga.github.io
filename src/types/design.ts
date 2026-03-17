import type { Vector3Tuple } from "three";

export type DesignElementType = "text" | "image";

export interface BaseDesignElement {
  id: string;
  type: DesignElementType;
  position: Vector3Tuple;
  scale: Vector3Tuple;
  rotation: number;
  side: "front" | "back";
  visible: boolean;
}

export interface TextElement extends BaseDesignElement {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: "normal" | "bold";
  color: string;
}

export interface ImageElement extends BaseDesignElement {
  type: "image";
  src: string;
  fileName: string;
  naturalWidth: number;
  naturalHeight: number;
}

export type DesignElement = TextElement | ImageElement;
