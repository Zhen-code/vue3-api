import { currentInstance } from "./component";
export function inject(key, defaultValue) {

    if (!currentInstance) return;
    const provides = currentInstance.parent?.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return defaultValue;
    }
  }
  