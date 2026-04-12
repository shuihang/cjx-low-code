export const NOOP = () => {}

/**
 * Always return false.
 */
export const NO = () => false

export const extend = Object.assign

export const isOn = (key: string) =>
  key.charCodeAt(0) === 111 /* o */ &&
  key.charCodeAt(1) === 110 /* n */ &&
  // uppercase letter
  (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97)
