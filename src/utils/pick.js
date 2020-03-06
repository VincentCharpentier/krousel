/**
 * pick only a set of properties from an object
 * @param obj source object
 * @param props array of props to pick
 * @return new object with only the picked properties
 */
export default function pick(obj, props) {
  return props.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}
