// Minimal JSX intrinsic elements shim for TSX in Vue
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}

export {}


