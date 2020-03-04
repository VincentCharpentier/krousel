/**
 * Modulo function that always return a positive result
 * @param a
 * @param n
 * @return {number}
 */
const posMod = (a, n) => ((a % n) + n) % n;

export default posMod;
