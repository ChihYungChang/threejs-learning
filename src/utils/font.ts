import {
  TextGeometry,
  TextGeometryParameters,
} from "three/examples/jsm/geometries/TextGeometry";

/**
 * 创建几何文字
 */
export const createTextGeometry = (
  text: string,
  config?: TextGeometryParameters
) => {
  const def = {
    size: 1,
    height: 3,
    curveSegments: 3,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5,
  };
  Object.assign(def, config);
  return new TextGeometry(text, def as TextGeometryParameters);
};
