/**
 * Return an object with the properties that are different in first and second param
 * @param obj1 first object
 * @param obj2 second object
 * @return {{}}
 */
export default function objectDiff(obj1, obj2) {
  let allKeys = Array.from(
    new Set(Object.keys(obj1).concat(Object.keys(obj2))),
  );
  return allKeys.reduce((acc, key) => {
    if (obj1[key] !== obj2[key]) acc[key] = obj2[key];
    return acc;
  }, {});
}
