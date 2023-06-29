let depth = 0;

// eslint-disable-next-line complexity
export function cleanObject(obj: any) {
  depth += 1;
  // eslint-disable-next-line no-restricted-syntax
  for (const propName in obj) {
    if (!obj[propName] || obj[propName].length === 0) {
      delete obj[propName];
    } else if (typeof obj === 'object') {
      if (depth <= 3) cleanObject(obj[propName]);
    }
  }
  return obj;
}
