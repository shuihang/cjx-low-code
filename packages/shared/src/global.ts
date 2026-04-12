/* istanbul ignore next */
function globalSelf() {
  try {
    if (typeof self !== 'undefined') {
      return self
    }
  } catch {}
  try {
    if (typeof window !== 'undefined') {
      return window
    }
  } catch {}
  try {
    if (typeof global !== 'undefined') {
      return global
    }
  } catch {}
  return new Function('return this')()
}
export const globalThisPolyfill: Window = globalSelf()
