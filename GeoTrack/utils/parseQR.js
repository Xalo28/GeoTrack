export function parseQR(data) {
  if (!data) return null;

  try {
    const obj = JSON.parse(data);

    if (!obj.NOMBRE || !obj.CEL || !obj.DIR || !obj.PROD || !obj.DISTRITO) {
      return null;
    }

    return {
      NOMBRE: obj.NOMBRE,
      CEL: obj.CEL,
      DIR: obj.DIR,
      PROD: obj.PROD,
      DISTRITO: obj.DISTRITO
    };

  } catch (e) {
    return null;
  }
}
