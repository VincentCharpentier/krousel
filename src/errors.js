export default class KrouselError extends Error {
  constructor(code) {
    super();
    this.errorCode = code;
  }
}

// BAD ARGUMENTS
export const INVALID_TARGET = 1;
export const TARGET_NOT_FOUND = 2;
