// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XCrud: typeof import('cjx-low-code')['XCrud']
    XForm: typeof import('cjx-low-code')['XForm']
    XEditTable: typeof import('cjx-low-code')['XEditTable']
    XDialog: typeof import('cjx-low-code')['XDialog']
  }

  interface ComponentCustomProperties {
    $XDialog: typeof import('cjx-low-code')['$XDialog']
  }
}

export {}
