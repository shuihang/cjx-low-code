import XForm from './components/form/index'
import XDialog from './components/dialog/index'
import XEditTable from './components/editTable/index'
import XCrud from './components/crud/index'
import type { Plugin } from 'vue'

export default [XCrud, XForm, XEditTable, XDialog] as unknown as Plugin[]
